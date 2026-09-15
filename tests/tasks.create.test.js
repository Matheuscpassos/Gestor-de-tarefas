const request = require("supertest");
const { buildTestApp } = require("./testUtils");

describe("POST /api/tasks", () => {
  let app, db;

  beforeEach(() => {
    ({ app, db } = buildTestApp());
  });

  afterEach(() => db.close());

  test("cria uma tarefa e retorna 201 com o registro completo", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "Escrever README" });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: "Escrever README", done: 0 });
    expect(res.body.id).toBeDefined();

    const stored = db.listTasks();
    expect(stored).toHaveLength(1);
  });

  test("rejeita título vazio com 400", async () => {
    const res = await request(app).post("/api/tasks").send({ title: "   " });
    expect(res.status).toBe(400);
  });

  test("rejeita corpo sem o campo title com 400", async () => {
    const res = await request(app).post("/api/tasks").send({});
    expect(res.status).toBe(400);
  });
});
