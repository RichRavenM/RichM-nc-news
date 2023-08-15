const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  insertCommentByArticleId,
} = require("../models/articles.models");

exports.getArticleById = (request, response, next) => {
  const { article_id } = request.params;
  selectArticleById(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

exports.getArticles = (request, response, next) => {
  selectArticles().then((articles) => {
    response.status(200).send({ articles });
  });
};
exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const promises = [
    selectCommentsByArticleId(article_id),
    selectArticleById(article_id),
  ];
  Promise.all(promises)
    .then((resolvedArray) => {
      comments = resolvedArray[0];
      response.status(200).send({ comments });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postCommentbyArticleId = (request, response, next) => {
  const { article_id } = request.params;
  const { body } = request;
  insertCommentByArticleId(body, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((error) => {
      next(error);
    });
};
