const db = require("../db/connection");

exports.selectArticles = (
  order = "desc",
  sort_by = "created_at",
  topic,
  limit = 15,
  p = 1,
  total_count = '0'
) => {
  const offset = limit * (p - 1);
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
  const acceptableTotalCounts = ['0', '1'];

  if (!acceptableOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (!acceptableSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let baseSQLString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at,articles.votes, articles.article_img_url, count(comments)::int AS comment_count `;

  if (!acceptableTotalCounts.includes(total_count)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }
  if (total_count === "1") {
    baseSQLString += `, count(*) OVER() AS total_count `;
  }

  baseSQLString += `FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    baseSQLString += `WHERE articles.topic = $3 `;
    queryValues.push(topic);
  }

  baseSQLString += `GROUP BY articles.article_id `;

  baseSQLString += `ORDER BY ${sort_by} ${order} `;

  baseSQLString += `LIMIT $1 OFFSET $2`;
  queryValues.unshift(limit, offset);

  return db.query(baseSQLString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.insertArticle = (body) => {
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [body.author, body.title, body.body, body.topic, body.article_img_url]
    )
    .then(({ rows }) => {
      rows[0].comment_count = 0;
      return rows[0];
    });
};

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

exports.updateArticleVotesById = (body, article_id) => {
  let baseSQLString = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`;
  return db
    .query(baseSQLString, [body.inc_votes, article_id])
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

exports.removeArticleById = (article_id) => {
  let baseSQLString = `DELETE FROM articles WHERE article_id = $1 RETURNING *`;
  return db.query(baseSQLString, [article_id]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: "Article id does not exist",
      });
    }
  });
};

exports.selectCommentsByArticleId = (article_id, limit = 10, p = 1) => {
  let baseSQLString = `SELECT comments.comment_id, comments.votes, comments.created_at, comments.author, comments.body,comments.article_id FROM comments LEFT JOIN articles ON comments.article_id = articles.article_id `;
  const queryValues = [];
  const offset = limit * (p - 1);
  if (article_id) {
    baseSQLString += `WHERE comments.article_id = $1`;
    queryValues.push(article_id);
  }

  baseSQLString += `ORDER BY comments.created_at DESC`;

  if (limit) {
    baseSQLString += ` LIMIT $2 OFFSET $3`;
    queryValues.push(limit, offset);
  }

  return db.query(baseSQLString, queryValues).then(({ rows }) => {
    return rows;
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
