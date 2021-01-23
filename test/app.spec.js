const app = require("../src/app");

describe("App", () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get("/").expect(200, "Hello, world!");
  });

  it('GET /api/test responds with 200 containing "json: {ok: true}"', () => {
    return supertest(app).get("/api/test").expect(200, {ok: true});
  });

  it('GET /api/food responds with 200 containing "json: {ok: true}"', () => {
    return supertest(app).get("/api/food").expect(200, { ok:true });
  });
});
