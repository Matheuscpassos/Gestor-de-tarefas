const path = require("path");
const express = require("express");
const { createTasksRouter } = require("./routes/tasks");

function createApp(db) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  app.get("/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api/tasks", createTasksRouter(db));

  return app;
}

module.exports = { createApp };
