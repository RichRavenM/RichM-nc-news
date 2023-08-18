const { getEndpoints } = require("../controllers/endpoints.controllers");
const { articlesRouter } = require("./articles-routers");
const { topicsRouter } = require("./topics-routers");
const { commentsRouter } = require("./comments-routers");
const { usersRouter } = require("./users-routers");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

apiRouter.use("/topics", topicsRouter);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/users", usersRouter);

module.exports = { apiRouter };
