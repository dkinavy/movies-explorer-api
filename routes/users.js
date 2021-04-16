const { updateUser, getMe } = require("../controllers/users");
const users = require("express").Router();
const { celebrate, Joi } = require("celebrate");

users.get("/users/me", getMe);

users.patch(
  "/users/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      email: Joi.string().email().required(),
    }),
  }),
  updateUser
);

module.exports = users;
