const request = require("supertest");
const { buildTestApp } = require("./testUtils");

describe("GET /health", () => {
  let app, db;

  beforeEach(() => {
    ({ app, db } = buildTestApp());
  });

  afterEach(() => db.close());

  test("responde 200 com status ok e a versão em execução", async () => {
    const res = await request(app).get("/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(typeof res.body.version).toBe("string");
    expect(res.body.version.length).toBeGreaterThan(0);
  });
});
