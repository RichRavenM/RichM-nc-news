exports.handleSqlErrors = (error, request, response, next) => {
  if (error.code === "22P02" || error.code === "23503" || error.code === '23502') {
    response.status(400).send({ msg: "Bad request" });
  } else {
    next(error);
  }
};

exports.handleCustomErrors = (error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ msg: error.msg });
  } else {
    next(error);
  }
};
