const path = require("path");
const express = require("express");
const { createTasksRouter } = require("./routes/tasks");
const pkg = require("../package.json");

function createApp(db) {
  const app = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, "public")));

  // A versão vem da imagem (APP_VERSION, definida no build/deploy); sem ela,
  // usa a do package.json. Serve para provar qual versão está no ar
  // (essencial para mostrar o deploy e o rollback).
  app.get("/health", (req, res) =>
    res.json({
      status: "ok",
      version: process.env.APP_VERSION || pkg.version,
      env: process.env.APP_ENV || "local",
    })
  );
  app.use("/api/tasks", createTasksRouter(db));

  return app;
}

module.exports = { createApp };
