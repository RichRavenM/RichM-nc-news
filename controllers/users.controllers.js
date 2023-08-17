const { selectUsers, SelectUserByUsername } = require("../models/users.models");

exports.getUsers = async (request, response, next) => {
  try {
    const users = await selectUsers();
    response.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

exports.getUserByUsername = async (request, response, next) => {
  const { username } = request.params;
  try {
    const user = await SelectUserByUsername(username);
    response.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
