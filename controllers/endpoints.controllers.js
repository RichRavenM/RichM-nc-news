const { selectEndpoints } = require("../models/endpoints.models");

exports.getEndpoints = (request, response, next) => {
  selectEndpoints().then((endpoints) => {
    endpoints = JSON.parse(endpoints);
    response.status(200).send({ endpoints });
  });
};
