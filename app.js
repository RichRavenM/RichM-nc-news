const {
  handleSqlErrors,
  handleCustomErrors,
  handle500Errors,
} = require("./controllers/errors.controllers");
const { apiRouter } = require("./routers/api-router");

const express = require("express");

const app = express();

app.use(express.json());

app.use("/api", apiRouter);

app.use((request, response) => {
  response.status(404).send({ msg: "Invalid url" });
});
app.use(handleSqlErrors);

app.use(handleCustomErrors);

app.use(handle500Errors);

module.exports = app;
