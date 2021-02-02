const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: 'test-user-1',
      full_name: 'Test user 1',
      nickname: 'TU1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      user_name: 'test-user-2',
      full_name: 'Test user 2',
      nickname: 'TU2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      user_name: 'test-user-3',
      full_name: 'Test user 3',
      nickname: 'TU3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      user_name: 'test-user-4',
      full_name: 'Test user 4',
      nickname: 'TU4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeRestaurantsArray(users) {
  return [
    {
      id: 1,
      restaurant_name: 'First test post!',
      rating: 1,
      cuisine: 'Chineese',
      author_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      meal: 'Fried Rice',
    },
    {
      id: 2,
      restaurant_name: 'Second test post!',
      rating: 2,
      cuisine: 'Mexican',
      author_id: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      meal: 'Carne Asada Tacos',
    },
    {
      id: 3,
      restaurant_name: 'Third test post!',
      rating: 3,
      cuisine: 'Indian',
      author_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      meal: 'Chicken Biryani',
    },
    {
      id: 4,
      restaurant_name: 'Fourth test post!',
      rating: 4,
      cuisine: 'American',
      author_id: users[3].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      meal: 'Hamburger',
    },
  ]
}

function makeCommentsArray(users, restaurants) {
  return [
    {
      id: 1,
      text: 'First test comment!',
      rating: 1,
      restaurant_id: restaurants[0].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      text: 'Second test comment!',
      rating: 2,
      restaurant_id: restaurants[0].id,
      user_id: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      text: 'Third test comment!',
      rating: 3,
      restaurant_id: restaurants[0].id,
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      text: 'Fourth test comment!',
      rating: 4,
      restaurant_id: restaurants[0].id,
      user_id: users[3].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 5,
      text: 'Fifth test comment!',
      rating: 5,
      restaurant_id: restaurants[restaurants.length - 1].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 6,
      text: 'Sixth test comment!',
      rating: 1,
      restaurant_id: restaurants[restaurants.length - 1].id,
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 7,
      text: 'Seventh test comment!',
      rating: 2,
      restaurant_id: restaurants[3].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeExpectedRestaurant(users, restaurant, comments=[]) {
  const author = users
    .find(user => user.id === restaurant.author_id)

  const number_of_comments = comments
    .filter(comment => comment.restaurant_id === restaurant.id)
    .length

  return {
    id: restaurant.id,
    cuisine: restaurant.cuisine,
    restaurant_name: restaurant.restaurant_name,
    rating: restaurant.rating,
    meal: restaurant.meal,
    date_created: restaurant.date_created.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
}

function makeExpectedRestaurantComments(users, restaurantId, comments) {
  const expectedComments = comments
    .filter(comment => comment.restaurant_id === restaurantId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      text: comment.text,
      rating: comment.rating,
      date_created: comment.date_created.toISOString(),
      user: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        full_name: commentUser.full_name,
        nickname: commentUser.nickname,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousRestaurant(user) {
  const maliciousRestaurant = {
    id: 911,
    style: 'Italian',
    date_created: new Date(),
    rating: 1,
    restaurant_name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    meal: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedRestaurant = {
    ...makeExpectedRestaurant([user], maliciousRestaurant),
    restaurant_name: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    meal: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousRestaurant,
    expectedRestaurant,
  }
}

function makeRestaurantsFixtures() {
  const testUsers = makeUsersArray()
  const testRestaurants = makeRestaurantsArray(testUsers)
  const testComments = makeCommentsArray(testUsers, testRestaurants)
  return { testUsers, testRestaurants, testComments }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        foodie_restaurants,
        foodie_users,
        foodie_comments
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE foodie_restaurants_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE foodie_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE foodie_comments_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('foodie_restaurants_id_seq', 0)`),
        trx.raw(`SELECT setval('foodie_users_id_seq', 0)`),
        trx.raw(`SELECT setval('foodie_comments_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('foodie_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('foodie_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedRestaurantsTables(db, users, restaurants, comments=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('foodie_restaurants').insert(restaurants)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('foodie_restaurants_id_seq', ?)`,
      [restaurants[restaurants.length - 1].id],
    )
    // only insert comments if there are some, also update the sequence counter
    if (comments.length) {
      await trx.into('foodie_comments').insert(comments)
      await trx.raw(
        `SELECT setval('foodie_comments_id_seq', ?)`,
        [comments[comments.length - 1].id],
      )
    }
  })
}

function seedMaliciousRestaurant(db, user, article) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('foodie_restaurants')
        .insert([article])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeRestaurantsArray,
  makeExpectedRestaurant,
  makeExpectedRestaurantComments,
  makeMaliciousRestaurant,
  makeCommentsArray,

  makeRestaurantsFixtures,
  cleanTables,
  seedRestaurantsTables,
  seedMaliciousRestaurant,
  makeAuthHeader,
  seedUsers,
}