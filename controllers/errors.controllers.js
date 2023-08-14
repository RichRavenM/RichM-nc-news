exports.handleErrorBadMethods = (request, response, next) => {
  response.status(405).send({ msg: "Invalid method used" });
};

exports.handleErrorBadUrl = (request, response) => {
  response.status(400).send({ msg: "Invalid url" });
};
