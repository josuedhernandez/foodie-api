const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Restaurants Endpoints", function () {
  let db;

  const {
    testUsers,
    testRestaurants,
    testComments,
  } = helpers.makeRestaurantsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/restaurants`, () => {
    context(`Given no restaurants`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/restaurants").expect(200, []);
      });
    });

    context("Given there are restaurants in the database", () => {
      beforeEach("insert restaurants", () =>
        helpers.seedRestaurantsTables(
          db,
          testUsers,
          testRestaurants,
          testComments
        )
      );

      it("responds with 200 and all of the restaurants", () => {
        const expectedRestaurants = testRestaurants.map((restaurant) =>
          helpers.makeExpectedRestaurant(testUsers, restaurant, testComments)
        );
        return supertest(app)
          .get("/api/restaurants")
          .expect(200, expectedRestaurants);
      });
    });

    context(`Given an XSS attack restaurant`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousRestaurant,
        expectedRestaurant,
      } = helpers.makeMaliciousRestaurant(testUser);

      beforeEach("insert malicious restaurant", () => {
        return helpers.seedMaliciousRestaurant(
          db,
          testUser,
          maliciousRestaurant
        );
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/restaurants`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].title).to.eql(expectedRestaurant.title);
            expect(res.body[0].meal).to.eql(expectedRestaurant.meal);
          });
      });
    });
  });

  describe(`GET /api/restaurants/:restaurant_id`, () => {
    context(`Given no restaurants`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const restaurantId = 123456;
        return supertest(app)
          .get(`/api/restaurants/${restaurantId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Restaurant doesn't exist` });
      });
    });

    context("Given there are restaurants in the database", () => {
      beforeEach("insert restaurants", () =>
        helpers.seedRestaurantsTables(
          db,
          testUsers,
          testRestaurants,
          testComments
        )
      );

      it("responds with 200 and the specified restaurant", () => {
        const restaurantId = 2;
        const expectedRestaurant = helpers.makeExpectedRestaurant(
          testUsers,
          testRestaurants[restaurantId - 1],
          testComments
        );

        return supertest(app)
          .get(`/api/restaurants/${restaurantId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedRestaurant);
      });
    });

    context(`Given an XSS attack restaurant`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const {
        maliciousRestaurant,
        expectedRestaurant,
      } = helpers.makeMaliciousRestaurant(testUser);

      beforeEach("insert malicious restaurant", () => {
        return helpers.seedMaliciousRestaurant(
          db,
          testUser,
          maliciousRestaurant
        );
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/restaurants/${maliciousRestaurant.id}`)
          .set("Authorization", helpers.makeAuthHeader(testUser))
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(expectedRestaurant.title);
            expect(res.body.meal).to.eql(expectedRestaurant.meal);
          });
      });
    });
  });

  describe(`GET /api/restaurants/:restaurant_id/comments`, () => {
    context(`Given no restaurants`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const restaurantId = 123456;
        return supertest(app)
          .get(`/api/restaurants/${restaurantId}/comments`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Restaurant doesn't exist` });
      });
    });

    context("Given there are comments for restaurant in the database", () => {
      beforeEach("insert restaurants", () =>
        helpers.seedRestaurantsTables(
          db,
          testUsers,
          testRestaurants,
          testComments
        )
      );

      it("responds with 200 and the specified comments", () => {
        const restaurantId = 1;
        const expectedComments = helpers.makeExpectedRestaurantComments(
          testUsers,
          restaurantId,
          testComments
        );

        return supertest(app)
          .get(`/api/restaurants/${restaurantId}/comments`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedComments);
      });
    });
  });
});
