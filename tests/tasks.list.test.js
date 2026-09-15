const request = require("supertest");
const { buildTestApp } = require("./testUtils");

describe("GET /api/tasks", () => {
  let app, db;

  beforeEach(() => {
    ({ app, db } = buildTestApp());
  });

  afterEach(() => db.close());

  test("retorna lista vazia quando não há tarefas", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test("retorna as tarefas criadas, em ordem de criação", async () => {
    db.createTask("Configurar pipeline de CI");
    db.createTask("Escrever testes de integração");

    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0].title).toBe("Configurar pipeline de CI");
    expect(res.body[1].title).toBe("Escrever testes de integração");
  });
});
