const knex = require("knex");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Auth /login and /refresh Endpoints", function () {
  let db;

  const { testUsers } = helpers.makeRestaurantsFixtures();
  const testUser = testUsers[0];

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

  describe(`POST /api/auth/login`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    const requiredFields = ["user_name", "password"];

    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password,
      };

      it(`responds with 400 required error when '${field}' is missing`, () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post("/api/auth/login")
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          });
      });
    });

    it(`responds 400 'invalid user_name or password' when bad user_name`, () => {
      const userInvalidUser = { user_name: "user-not", password: "existy" };
      return supertest(app)
        .post("/api/auth/login")
        .send(userInvalidUser)
        .expect(400, { error: `Incorrect user_name or password` });
    });

    it(`responds 400 'invalid user_name or password' when bad password`, () => {
      const userInvalidPass = {
        user_name: testUser.user_name,
        password: "incorrect",
      };
      return supertest(app)
        .post("/api/auth/login")
        .send(userInvalidPass)
        .expect(400, { error: `Incorrect user_name or password` });
    });

    it(`responds 200 and JWT auth token using secret when valid credentials`, () => {
      const userValidCreds = {
        user_name: testUser.user_name,
        password: testUser.password,
      };
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/login")
        .send(userValidCreds)
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });

  describe(`POST /api/auth/refresh`, () => {
    beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

    it(`responds 200 and JWT auth token using secret`, () => {
      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        {
          subject: testUser.user_name,
          expiresIn: process.env.JWT_EXPIRY,
          algorithm: "HS256",
        }
      );
      return supertest(app)
        .post("/api/auth/refresh")
        .set("Authorization", helpers.makeAuthHeader(testUser))
        .expect(200, {
          authToken: expectedToken,
        });
    });
  });
});

describe("Sign up Endpoint", function () {
  let db;

  const { testUsers } = helpers.makeRestaurantsFixtures();
  const testUser = testUsers[0];

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

  describe(`POST /api/auth/signup`, () => {
    context(`User Validation`, () => {
      beforeEach("insert users", () => helpers.seedUsers(db, testUsers));

      const requiredFields = ["user_name", "password", "full_name"];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          user_name: "test user_name",
          password: "test password",
          full_name: "test full_name",
          nickname: "test nickname",
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post("/api/auth/signup")
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });

      it(`responds 400 'Password be longer than 8 characters' when empty password`, () => {
        const userShortPassword = {
          user_name: "test user_name",
          password: "1234567",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(userShortPassword)
          .expect(400, { error: `Password be longer than 8 characters` });
      });

      it(`responds 400 'Password be less than 72 characters' when long password`, () => {
        const userLongPassword = {
          user_name: "test user_name",
          password: "*".repeat(73),
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(userLongPassword)
          .expect(400, { error: `Password be less than 72 characters` });
      });

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          user_name: "test user_name",
          password: " 1Aa!2Bb@",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(userPasswordStartsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`,
          });
      });

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          user_name: "test user_name",
          password: "1Aa!2Bb@ ",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces`,
          });
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          user_name: "test user_name",
          password: "11AAaabb",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(userPasswordNotComplex)
          .expect(400, {
            error: `Password must contain one upper case, lower case, number and special character`,
          });
      });

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          user_name: testUser.user_name,
          password: "11AAaa!!",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` });
      });
    });

    context(`Happy path`, () => {
      it(`responds 201, serialized user, storing bcryped password`, () => {
        const newUser = {
          user_name: "test user_name",
          password: "11AAaa!!",
          full_name: "test full_name",
        };
        return supertest(app)
          .post("/api/auth/signup")
          .send(newUser)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property("id");
            expect(res.body.user_name).to.eql(newUser.user_name);
            expect(res.body.full_name).to.eql(newUser.full_name);
            expect(res.body.nickname).to.eql("");
            expect(res.body).to.not.have.property("password");
            expect(res.headers.location).to.eql(
              `/api/auth/signup/${res.body.id}`
            );
            const expectedDate = new Date().toLocaleString("en", {
              timeZone: "UTC",
            });
            const actualDate = new Date(res.body.date_created).toLocaleString();
            expect(actualDate).to.eql(expectedDate);
          })
          .expect((res) =>
            db
              .from("foodie_users")
              .select("*")
              .where({ id: res.body.id })
              .first()
              .then((row) => {
                expect(row.user_name).to.eql(newUser.user_name);
                expect(row.full_name).to.eql(newUser.full_name);
                expect(row.nickname).to.eql(null);
                const expectedDate = new Date().toLocaleString("en", {
                  timeZone: "UTC",
                });
                const actualDate = new Date(row.date_created).toLocaleString();
                expect(actualDate).to.eql(expectedDate);

                return bcrypt.compare(newUser.password, row.password);
              })
              .then((compareMatch) => {
                expect(compareMatch).to.be.true;
              })
          );
      });
    });
  });
});
