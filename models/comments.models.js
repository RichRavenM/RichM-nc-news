const db = require("../db/connection");

exports.selectCommentsById = async (comment_id) => {
  const { rows } = await db.query(
    `SELECT * FROM comments WHERE comment_id = $1`,
    [comment_id]
  );
  if (!rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Comment id does not exist",
    });
  }
};

exports.removeCommentById = async (comment_id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *`,
    [comment_id]
  );
  if (!rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Comment id does not exist",
    });
  }
};

exports.updateCommentVotesById = async (body, comment_id) => {
  let baseSQLString = `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`;
  const { rows } = await db.query(baseSQLString, [body.inc_votes, comment_id]);
  if (!rows.length) {
    return Promise.reject({
      status: 404,
      msg: "Article id does not exist",
    });
  }
  return rows[0];
};
