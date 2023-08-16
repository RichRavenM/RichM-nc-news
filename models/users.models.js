const db = require("../db/connection");

exports.selectUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};

exports.SelectUserByUsername = (username) => {
  let baseSQLString = `SELECT * FROM users `;
  const queryvalue = [];
  if (username) {
    baseSQLString += `WHERE username = $1`;
    queryvalue.push(username);
  }
  return db.query(baseSQLString, queryvalue).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({ status: 404, msg: "User does not exist" });
    }
    return rows[0];
  });
};
