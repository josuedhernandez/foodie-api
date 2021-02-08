const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
  let db

  const {
    testRestaurants,
    testUsers,
  } = helpers.makeRestaurantsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/comments`, () => {
    beforeEach('insert restaurants', () =>
      helpers.seedRestaurantsTables(
        db,
        testUsers,
        testRestaurants,
      )
    )

    it(`creates a comment, responding with 201 and the new comment`, function() {
      this.retries(3)
      const testRestaurant = testRestaurants[0]
      const testUser = testUsers[0]
      const newComment = {
        text: 'Test new comment',
        restaurant_id: testRestaurant.id,
        rating: 3,
      }
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.text).to.eql(newComment.text)
          expect(res.body.restaurant_id).to.eql(newComment.restaurant_id)
          expect(res.body.rating).to.eql(newComment.rating)
          expect(res.body.user.id).to.eql(testUser.id)
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`)
          const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
        .expect(res =>
          db
            .from('foodie_comments')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.text).to.eql(newComment.text)
              expect(row.restaurant_id).to.eql(newComment.restaurant_id)
              expect(row.rating).to.eql(newComment.rating)
              expect(row.user_id).to.eql(testUser.id)
              const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
              const actualDate = new Date(row.date_created).toLocaleString()
              expect(actualDate).to.eql(expectedDate)
            })
        )
    })

    const requiredFields = ['text', 'restaurant_id']

    requiredFields.forEach(field => {
      const testRestaurant = testRestaurants[0]
      const testUser = testUsers[0]
      const newComment = {
        text: 'Test new comment',
        restaurant_id: testRestaurant.id,
        rating: 3
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newComment[field]

        return supertest(app)
          .post('/api/comments')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newComment)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})