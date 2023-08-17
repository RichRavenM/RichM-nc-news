const db = require("../db/connection");

exports.selectTopics = async () => {
  const { rows } = await db.query("SELECT * FROM topics");
  return rows;
};

exports.checkTopicExists = async (topic) => {
  const { rows } = await db.query(`SELECT slug FROM topics`);
  if (rows.every((row) => row.slug !== topic)) {
    return Promise.reject({ status: 404, msg: "Topic does not exist" });
  }
};

exports.insertTopic = async (body) => {
  const { rows } = await db
    .query(
      `INSERT INTO topics (slug,description) VALUES ($1, $2) RETURNING *`,
      [body.slug, body.description]
    );
  return rows[0];
};
