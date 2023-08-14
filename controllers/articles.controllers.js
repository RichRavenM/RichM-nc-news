const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
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
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      if (comments.length) {
        response.status(200).send({ comments });
      } else {
        return selectArticleById(article_id);
      }
    })
    .then((comments) => {
      response.status(200).send({ comments: [] });
    })
    .catch((error) => {
      next(error);
    });
};
