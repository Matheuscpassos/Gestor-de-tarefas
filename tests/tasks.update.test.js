const request = require("supertest");
const { buildTestApp } = require("./testUtils");

/**
 * PUT /api/tasks/:id — ATUALIZAÇÃO DE TAREFA
 * ============================================
 * Esta funcionalidade está ABERTA para contribuição de outra pessoa do
 * grupo (ver docs/TAREFA_ABERTA.md para o passo a passo e os critérios de
 * aceite, e a branch `feature/update-task`, já criada com um ponto de
 * partida).
 *
 * O teste abaixo descreve o comportamento esperado quando a rota estiver
 * pronta, mas fica marcado como `test.todo` de propósito — assim o Jest
 * lista ele como pendente (não falha o CI) até alguém remover o `.todo` e
 * implementar de verdade em src/db.js e src/routes/tasks.js.
 */
describe("PUT /api/tasks/:id", () => {
  test.todo("atualiza o título e o status 'done' de uma tarefa existente e retorna 200");
  test.todo("retorna 404 ao tentar atualizar uma tarefa que não existe");
  test.todo("retorna 400 se o corpo da requisição não tiver nenhum campo válido para atualizar");

  // Este teste roda de verdade e documenta o estado ATUAL (ainda não
  // implementado) — quando a rota for concluída, apague este teste e
  // promova os três `test.todo` acima para testes de verdade.
  test("hoje a rota ainda responde 501 (ainda não implementada)", async () => {
    const { app, db } = buildTestApp();
    const task = db.createTask("Tarefa de exemplo");

    const res = await request(app).put(`/api/tasks/${task.id}`).send({ title: "Novo título" });
    expect(res.status).toBe(501);

    db.close();
  });
});
