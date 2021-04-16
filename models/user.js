const mongoose = require("mongoose");
var validator = require("validator");
const BadRequestError = require("../errors/BadRequestError");

const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Введите корректный Email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    minlength: 2,
  },

  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        const r = new BadRequestError("Не найден такой пользователь");
        throw r;
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          const r = new BadRequestError("Не найден такой пользователь");
          throw r;
        }
        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
