// const app = require("../src/app");

// describe(`Protected endpoints`, () => {
//   describe(`GET /`, () => {
//     it(`responds with 401 'Missing basic token' when no basic token`, () => {
//       return supertest(app)
//         .get(`/`)
//         .expect(401, { error: `Missing basic token` });
//     });
//   });

//   describe(`GET /api/test`, () => {
//     it(`responds with 401 'Missing basic token' when no basic token`, () => {
//       return supertest(app)
//         .get(`/api/test`)
//         .expect(401, { error: `Missing basic token` });
//     });
//   });
// });

// describe("App Protected Endpoints", () => {
//   // User for testing
//   user = { user_name: "Test", password: "1212" };

//   function makeAuthHeader(user) {
//     const token = Buffer.from(`${user.user_name}:${user.password}`).toString(
//       "base64"
//     );
//     console.log(token)
//     return `Basic ${token}`;
//   }

//   it('GET / responds with 200 containing "Hello, world!"', () => {
//     return supertest(app)
//       .get("/")
//       .set("Authorization", makeAuthHeader(user))
//       .expect(200, "Hello, world!");
//   });

//   it('GET /api/test responds with 200 containing "json: {ok: true}"', () => {
//     return supertest(app)
//       .get("/api/test")
//       .set("Authorization", makeAuthHeader(user))
//       .expect(200, { ok: true });
//   });

//   it('GET /api/food responds with 200 containing "json: {ok: true}"', () => {
//     return supertest(app)
//       .get("/api/food")
//       .set("Authorization", makeAuthHeader(user))
//       .expect(200, { ok: true });
//   });

//   it(`responds 401 'Unauthorized request' when no credentials in token`, () => {
//     const userNoCreds = { user_name: "", password: "" };
//     return supertest(app)
//       .get(`/api/test`)
//       .set("Authorization", makeAuthHeader(userNoCreds))
//       .expect(401, { error: `Unauthorized request` });
//   });

//   it(`responds 401 'Unauthorized request' when invalid user`, () => {
//     const userInvalidCreds = { user_name: "user-not", password: "existy" };
//     return supertest(app)
//       .get(`/api/test`)
//       .set("Authorization", makeAuthHeader(userInvalidCreds))
//       .expect(401, { error: `Unauthorized request` });
//   });
// });
