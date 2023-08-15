const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let baseSQLString = `SELECT * FROM articles `;
  if (article_id) {
    baseSQLString += `WHERE article_id = $1`;
  }

  return db.query(baseSQLString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article id does not exist",
      });
    }
    return rows[0];
  });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, count(comments) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.selectCommentsByArticleId = (article_id) => {
  let baseSQLString = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body,comments.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id `;

  if (article_id) {
    baseSQLString += `WHERE comments.article_id = $1`;
  }

  baseSQLString += `ORDER BY comments.created_at DESC`;

  return db.query(baseSQLString, [article_id]).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleVotesById = (body, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [body.inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      }
      if (rows[0].votes < 0) {
        return Promise.reject({
          status: 400,
          msg: "Cannot set votes to be a negative number",
        });
      }
      return rows[0];
    });
};
