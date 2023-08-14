const fs = require("fs/promises");

exports.selectEndpoints = () => {
  return fs.readFile(
    "/home/rich/northcoders/backend/be-nc-news/endpoints.json",
    "utf-8"
  );
};
