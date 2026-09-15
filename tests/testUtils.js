const { createApp } = require("../src/server");
const { createDb } = require("../src/db");

function buildTestApp() {
  const db = createDb(":memory:");
  const app = createApp(db);
  return { app, db };
}

module.exports = { buildTestApp };
