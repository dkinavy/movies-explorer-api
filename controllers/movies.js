const Movie = require("../models/movie");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

module.exports.getMovies = (req, res, next) => {
  //console.log(req.user);
  const owner = req.user._id;
  Movie.find({ owner })
    .then((cards) => {
      if (!cards) {
        const error = new NotFoundError("Не найден пользователь с таким ID");
        next(error);
      } else {
        res.send({ cards });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new BadRequestError("Недопустимые символы");
        next(error);
      } else if (err.name === "CastError") {
        const error = new BadRequestError("Неверный формат ID");
        next(error);
      }
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  //console.log(req.user);
  const owner = req.user._id;
  Movie.create({ owner: owner, ...req.body })
    .then((movie) => {
      if (!movie) {
        const error = new NotFoundError("Не найден пользователь с таким ID");
        next(error);
      } else {
        res.send({ movie });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new BadRequestError("Недопустимые символы");
        next(error);
      } else if (err.name === "CastError") {
        const error = new BadRequestError("Неверный формат ID");
        next(error);
      }
      next(err);
    });
};
module.exports.deleteMovie = (req, res, next) => {
  //console.log(req.user);
  Movie.findByIdAndRemove(req.params._id)
    .then((movie) => {
      if (!movie) {
        const r = new NotFoundError("Нет фильма с таким идентификатором");
        next(r);
      } else if (movie.owner.toString() !== req.user._id) {
        const r = new ForbiddenError("Нельзя удалять чужие фильмы");
        next(r);
      } else {
        res.send({ data: movie });
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        const r = new BadRequestError("Неверный формат ID");
        next(r);
      }
      next(err);
    });
};
