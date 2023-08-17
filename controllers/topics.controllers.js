const { response } = require("../app");
const { selectTopics, insertTopic } = require("../models/topics.models");

exports.getTopics = async (request, response, next) => {
  try {
    const topics = await selectTopics();
    response.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
};

exports.postTopic = async (request, response, next) => {
  const { body } = request;
  try {
    const topic = await insertTopic(body);
    response.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};
