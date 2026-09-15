const request = require("supertest");
const { buildTestApp } = require("./testUtils");

describe("DELETE /api/tasks/:id", () => {
  let app, db;

  beforeEach(() => {
    ({ app, db } = buildTestApp());
  });

  afterEach(() => db.close());

  test("remove uma tarefa existente e retorna 204", async () => {
    const task = db.createTask("Tarefa a ser removida");

    const res = await request(app).delete(`/api/tasks/${task.id}`);
    expect(res.status).toBe(204);
    expect(db.listTasks()).toHaveLength(0);
  });

  test("retorna 404 ao tentar remover uma tarefa inexistente", async () => {
    const res = await request(app).delete("/api/tasks/9999");
    expect(res.status).toBe(404);
  });
});
