const {
  getMovies,
  createMovie,
  deleteMovie,
} = require("../controllers/movies");
const movieRouter = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const { isURL } = require("validator");

movieRouter.get("/movies", getMovies);

movieRouter.post(
  "/movies",
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(1).max(30),
      director: Joi.string().required().min(1).max(30),
      duration: Joi.number().required(),
      year: Joi.string().required().min(2).max(4),
      description: Joi.string().required().min(1).max(300),
      image: Joi.string()
        .required()
        .custom((value) => {
          if (!isURL(value)) throw new CelebrateError("Некорректный URL");
          return value;
        }),
      trailer: Joi.string()
        .required()
        .custom((value) => {
          if (!isURL(value)) throw new CelebrateError("Некорректный URL");
          return value;
        }),
      thumbnail: Joi.string()
        .required()
        .custom((value) => {
          if (!isURL(value)) throw new CelebrateError("Некорректный URL");
          return value;
        }),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required().min(1).max(30),
      nameEN: Joi.string().required().min(1).max(30),
    }),
  }),
  createMovie
);

movieRouter.delete(
  "/movies/:_id",
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().length(24),
    }),
  }),
  deleteMovie
);

module.exports = movieRouter;
