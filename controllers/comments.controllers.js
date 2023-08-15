const {
  selectCommentsById,
  removeCommentById,
} = require("../models/comments.models");

exports.getCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  selectCommentsById(comment_id)
    .then(() => {
      response.status(200).send();
    })
    .catch((error) => {
      next(error);
    });
};

exports.deleteCommentById = (request, response, next) => {
  const { comment_id } = request.params;
  removeCommentById(comment_id)
    .then(() => {
      response.status(204).send();
    })
    .catch((error) => {
      next(error);
    });
};
