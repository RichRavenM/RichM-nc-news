const db = require("../db/connection");

exports.selectCommentsById = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment id does not exist",
        });
      }
    });
};

exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment id does not exist",
        });
      }
    });
};

exports.updateCommentVotesById = (body, comment_id) => {
  let baseSQLString = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;
  return db
    .query(baseSQLString, [body.inc_votes, comment_id])
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
