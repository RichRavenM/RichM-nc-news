const {
  selectCommentsById,
  removeCommentById,
  updateCommentVotesById,
} = require("../models/comments.models");

exports.getCommentById = async (request, response, next) => {
  const { comment_id } = request.params;
  try {
    await selectCommentsById(comment_id);
    response.status(200).send();
  } catch (error) {
    next(error);
  }
};

exports.deleteCommentById = async (request, response, next) => {
  const { comment_id } = request.params;
  try {
    await removeCommentById(comment_id);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
};

exports.patchCommentById = async (request, response, next) => {
  const { comment_id } = request.params;
  const { body } = request;
  try {
    const comment = await updateCommentVotesById(body, comment_id);
    response.status(200).send({ comment });
  } catch (error) {
    next(error);
  }
};
