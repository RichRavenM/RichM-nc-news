const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db.query(`SELECT slug FROM topics`).then(({ rows }) => {
    if (rows.every((row) => row.slug !== topic)) {
      return Promise.reject({ status: 404, msg: "Topic does not exist" });
    }
  });
};
