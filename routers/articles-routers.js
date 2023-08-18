const {
    getArticleById,
    getCommentsByArticleId,
    getArticles,
    patchArticleById,
    postCommentbyArticleId,
    postArticles,
    deleteArticlebyId,
  } = require("../controllers/articles.controllers");
  
  const articlesRouter = require("express").Router();
  
  articlesRouter.route("/").get(getArticles).post(postArticles);
  
  articlesRouter
    .route("/:article_id")
    .get(getArticleById)
    .patch(patchArticleById)
    .delete(deleteArticlebyId);
  
  articlesRouter
    .route("/:article_id/comments")
    .get(getCommentsByArticleId)
    .post(postCommentbyArticleId);
    
  module.exports = { articlesRouter };
  