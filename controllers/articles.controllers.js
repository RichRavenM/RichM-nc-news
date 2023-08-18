const {
  selectArticleById,
  selectArticles,
  selectCommentsByArticleId,
  updateArticleVotesById,
  insertCommentByArticleId,
  insertArticle,
  removeArticleById,
} = require("../models/articles.models");

const { checkTopicExists } = require("../models/topics.models");

exports.getArticles = async (request, response, next) => {
  const { order, sort_by, topic, limit, p, total_count } = request.query;
  const promises = [
    selectArticles(order, sort_by, topic, limit, p, total_count),
  ];
  if (topic) {
    promises.push(checkTopicExists(topic));
  }
  try {
    const resolvedPromises = await Promise.all(promises);
    const articles = resolvedPromises[0][0];
    const responseBody = {articles}
    if (total_count) {
      const total_count = resolvedPromises[0][1];
      responseBody.total_count = total_count
    }
    response.status(200).send(responseBody);
  } catch (error) {
    next(error);
  }
};

exports.postArticles = async (request, response, next) => {
  const { body } = request;
  try {
    const article = await insertArticle(body);
    response.status(201).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.getArticleById = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    const article = await selectArticleById(article_id);
    response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.patchArticleById = async (request, response, next) => {
  const { article_id } = request.params;
  const { body } = request;
  try {
    const article = await updateArticleVotesById(body, article_id);
    response.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};

exports.deleteArticlebyId = async (request, response, next) => {
  const { article_id } = request.params;
  try {
    await removeArticleById(article_id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.getCommentsByArticleId = async (request, response, next) => {
  const { article_id } = request.params;
  const { limit, p } = request.query;
  const promises = [
    selectCommentsByArticleId(article_id, limit, p),
    selectArticleById(article_id),
  ];
  try {
    const resolvedPromises = await Promise.all(promises);
    comments = resolvedPromises[0];
    response.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};

exports.postCommentbyArticleId = async (request, response, next) => {
  const { article_id } = request.params;
  const { body } = request;
  try {
    const comment = await insertCommentByArticleId(body, article_id);
    response.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};
