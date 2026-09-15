const { createApp } = require("./server");
const { createDb } = require("./db");

const PORT = process.env.PORT || 3000;

const db = createDb();
const app = createApp(db);

app.listen(PORT, () => {
  console.log(`Gestor de Tarefas rodando em http://localhost:${PORT}`);
});
