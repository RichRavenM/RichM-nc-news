const express = require("express");
const { getTopics, postTopic } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getCommentsByArticleId,
  getArticles,
  patchArticleById,
  postCommentbyArticleId,
  postArticles,
  deleteArticlebyId,
} = require("./controllers/articles.controllers");
const {
  getCommentById,
  deleteCommentById,
  patchCommentById,
} = require("./controllers/comments.controllers");
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");
const {
  handleSqlErrors,
  handleCustomErrors,
} = require("./controllers/errors.controllers");
const { getEndpoints } = require("./controllers/endpoints.controllers");

const app = express();
app.use(express.json());
app.get("/api/topics", getTopics);
app.post("/api/topics", postTopic);
app.get("/api", getEndpoints);
app.get("/api/articles", getArticles);
app.post("/api/articles", postArticles);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleById);
app.delete("/api/articles/:article_id", deleteArticlebyId);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentbyArticleId);
app.get("/api/comments/:comment_id", getCommentById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.patch("/api/comments/:comment_id", patchCommentById);
app.get("/api/users", getUsers);
app.get("/api/users/:username", getUserByUsername);

app.use((request, response) => {
  response.status(404).send({ msg: "Invalid url" });
});
app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
