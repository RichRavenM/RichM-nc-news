const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById, getArticles } = require("./controllers/articles.controllers");
const {
  handleErrorBadUrl,
  handleSqlErrors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get('/api/articles',getArticles)

app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.get("*", handleErrorBadUrl);
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { app };
