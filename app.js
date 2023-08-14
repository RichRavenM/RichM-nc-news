const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleErrorBadMethods,
  handleErrorBadUrl,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.post("/api/topics", handleErrorBadMethods);
app.put("/api/topics", handleErrorBadMethods);
app.patch("/api/topics", handleErrorBadMethods);
app.delete("/api/topics", handleErrorBadMethods);

app.get("*", handleErrorBadUrl);
app.post("*", handleErrorBadUrl);
app.put("*", handleErrorBadUrl);
app.patch("*", handleErrorBadUrl);
app.delete("*", handleErrorBadUrl);

module.exports = { app };
