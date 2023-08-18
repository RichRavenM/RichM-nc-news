const {
    getCommentById,
    deleteCommentById,
    patchCommentById,
  } = require("../controllers/comments.controllers");
  
  const commentsRouter = require("express").Router();
  
  commentsRouter
    .route("/:comment_id")
    .get(getCommentById)
    .patch(patchCommentById)
    .delete(deleteCommentById);
  
  module.exports = { commentsRouter };
  