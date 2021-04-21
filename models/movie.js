const mongoose = require("mongoose");
var validator = require("validator");
const BadRequestError = require("../errors/BadRequestError");

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Введите корректный URL",
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Введите корректный URL",
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Введите корректный URL",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("movie", movieSchema);
