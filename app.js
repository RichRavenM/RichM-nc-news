const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleErrorBadMethods,
  handleErrorBadUrl,
} = require("./controllers/errors.controllers");

const app = express();

app.get("/api/topics", getTopics);


app.get("*", handleErrorBadUrl);


module.exports = { app };
