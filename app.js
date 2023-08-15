const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getCommentsByArticleId,
  getArticles,
  postCommentbyArticleId,
} = require("./controllers/articles.controllers");
const {
  handleSqlErrors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentbyArticleId);

app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use((request, response) => {
  response.status(404).send({ msg: "Invalid url" });
});
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
};

module.exports = { app };
