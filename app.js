const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getCommentsByArticleId,
  getArticles,
  patchArticleById,
  postCommentbyArticleId,
} = require("./controllers/articles.controllers");
const {
  getCommentById,
  deleteCommentById,
} = require("./controllers/comments.controllers");
const { getUsers } = require("./controllers/users.controllers");
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
app.patch("/api/articles/:article_id", patchArticleById);
app.post("/api/articles/:article_id/comments", postCommentbyArticleId);
app.get("/api/comments/:comment_id", getCommentById);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", getUsers);

app.use((request, response) => {
  response.status(404).send({ msg: "Invalid url" });
});
app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ msg: "Internal Server Error" });
})

module.exports =  app;
