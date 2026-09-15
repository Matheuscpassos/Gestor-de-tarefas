const express = require("express");

function createTasksRouter(db) {
  const router = express.Router();

  // GET /api/tasks — lista todas as tarefas
  router.get("/", (req, res) => {
    res.json(db.listTasks());
  });

  // POST /api/tasks — cria uma tarefa nova
  router.post("/", (req, res) => {
    const { title } = req.body || {};
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "O campo 'title' é obrigatório." });
    }
    const task = db.createTask(title.trim());
    res.status(201).json(task);
  });

  // DELETE /api/tasks/:id — remove uma tarefa
  router.delete("/:id", (req, res) => {
    const id = Number(req.params.id);
    const removed = db.deleteTask(id);
    if (!removed) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }
    res.status(204).send();
  });

  // PUT /api/tasks/:id — atualiza uma tarefa existente
  //
  // ABERTO PARA CONTRIBUIÇÃO — ver docs/TAREFA_ABERTA.md
  // Hoje só devolve 501 (Not Implemented). A ideia é permitir editar o
  // "title" e/ou marcar "done" como concluída. O teste que precisa passar
  // está em tests/tasks.update.test.js.
  router.put("/:id", (req, res) => {
    res.status(501).json({
      error: "Ainda não implementado — ver docs/TAREFA_ABERTA.md e a branch feature/update-task",
    });
  });

  return router;
}

module.exports = { createTasksRouter };
