const { selectArticleById } = require("../models/articles.models");
const { selectArticles } = require("../models/articles.models");

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
