exports.handleErrorBadUrl = (request, response) => {
  response.status(404).send({ msg: "Invalid url" });
};
