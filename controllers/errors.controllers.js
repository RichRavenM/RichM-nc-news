exports.handleErrorBadUrl = (request, response) => {
  response.status(400).send({ msg: "Invalid url" });
};
