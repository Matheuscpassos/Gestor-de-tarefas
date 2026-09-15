const path = require("path");
const Database = require("better-sqlite3");

// Em teste, cada arquivo de teste recebe seu próprio banco em memória
// (via NODE_ENV=test + DB_PATH=":memory:"), então os testes nunca sujam o
// banco de desenvolvimento nem dependem de ordem de execução.
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data.sqlite3");

function createDb(dbPath = DB_PATH) {
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  return {
    listTasks() {
      return db.prepare("SELECT * FROM tasks ORDER BY id ASC").all();
    },

    getTask(id) {
      return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    },

    createTask(title) {
      const info = db.prepare("INSERT INTO tasks (title) VALUES (?)").run(title);
      return this.getTask(info.lastInsertRowid);
    },

    deleteTask(id) {
      const info = db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
      return info.changes > 0;
    },

    // TODO(@amigo): implementar a atualização de verdade.
    // Ver docs/TAREFA_ABERTA.md para o que precisa ser feito e os
    // critérios de aceite. O teste correspondente está em
    // tests/tasks.update.test.js (hoje marcado como test.todo).
    updateTask(_id, _changes) {
      throw new Error("updateTask ainda não foi implementado — ver docs/TAREFA_ABERTA.md");
    },

    close() {
      db.close();
    },
  };
}

module.exports = { createDb };
