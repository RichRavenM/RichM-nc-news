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
