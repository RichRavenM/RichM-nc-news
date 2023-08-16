const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateArticleVotesById,
  insertCommentByArticleId,
  insertArticle,
} = require("../models/articles.models");

const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = (request, response, next) => {
  const { order, sort_by, topic } = request.query;
  const promises = [selectArticles(order, sort_by, topic)];
  if (topic) {
    promises.push(checkTopicExists(topic));
  }
  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      response.status(200).send({ articles });
    })
    .catch((error) => {
      next(error);
    });
};

exports.postArticles = (request, response, next) => {
  const { body } = request;
  insertArticle(body)
    .then((article) => {
      response.status(201).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};

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

exports.patchArticleById = (request, response, next) => {
  const { article_id } = request.params;
  const { body } = request;
  updateArticleVotesById(body, article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((error) => {
      next(error);
    });
};
