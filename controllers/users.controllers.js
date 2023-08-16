const { selectUsers, SelectUserByUsername } = require("../models/users.models");

exports.getUsers = (request, response, next) => {
  selectUsers().then((users) => {
    response.status(200).send({ users });
  });
};

exports.getUserByUsername = (request, response, next) => {
  const { username } = request.params;
  SelectUserByUsername(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch((error) => {
      next(error);
    });
};
