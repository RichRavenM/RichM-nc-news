const db = require("../db/connection");

exports.selectUsers = async () => {
  const { rows } = await db.query(`SELECT * FROM users`);
  return rows;
};

exports.SelectUserByUsername = async (username) => {
  let baseSQLString = `SELECT * FROM users `;
  const queryvalue = [];
  if (username) {
    baseSQLString += `WHERE username = $1`;
    queryvalue.push(username);
  }
  const { rows } = await db.query(baseSQLString, queryvalue);
  if (!rows.length) {
    return Promise.reject({ status: 404, msg: "User does not exist" });
  }
  return rows[0];
};
