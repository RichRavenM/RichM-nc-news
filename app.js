const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  handleErrorBadUrl,
} = require("./controllers/errors.controllers");
const {getEndpoints} = require('./controllers/endpoints.controllers')

const app = express();

app.get("/api/topics", getTopics);
app.get('/api', getEndpoints)


app.get("*", handleErrorBadUrl);


module.exports = { app };
