const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  let baseSQLString = `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, 
  articles.article_img_url, count(comments)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;
  if (article_id) {
    baseSQLString += `WHERE articles.article_id = $1 `;
  }

  baseSQLString += `GROUP BY articles.article_id;`;

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

exports.selectArticles = (order = "desc", sort_by = "created_at", topic) => {
  const queryValues = [];
  const acceptableOrders = ["asc", "desc"];
  const acceptableSortBys = [
    "author",
    "title",
    "topic",
    "article_id",
    "comment_count",
    "article_img_url",
    "votes",
    "created_at",
  ];

  if (!acceptableOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!acceptableSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let baseSQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, count(comments)::int AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    baseSQLString += `WHERE articles.topic = $1 `;
    queryValues.push(topic);
  }

  baseSQLString += `GROUP BY articles.article_id `;

  baseSQLString += `ORDER BY ${sort_by} ${order};`;

  return db.query(baseSQLString, queryValues).then(({ rows }) => {
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
      return rows[0];
    });
};
exports.insertCommentByArticleId = (body, article_id) => {
  return db
    .query(
      `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
      [body.username, body.body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
