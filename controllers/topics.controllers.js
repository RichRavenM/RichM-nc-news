const { response } = require("../app");
const { selectTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = (request, response, next) => {
  selectTopics().then((topics) => {
    response.status(200).send({ topics });
  });
};

exports.postTopic = (request, response, next) => {
  const { body } = request;
  insertTopic(body)
    .then((topic) => {
      response.status(201).send({ topic });
    })
    .catch((error) => {
      next(error);
    });
};
