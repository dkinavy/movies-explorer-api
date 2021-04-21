const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ConflictError = require("../errors/ConflictError");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  //console.log(req.body);
  const { email, password, name } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name }))
    .catch((err) => {
      if (err.name === "MongoError" || err.code === 11000) {
        const error = new ConflictError("Такой пользователь уже есть");
        next(error);
      } else if (err.name === "ValidationError") {
        //res.status(400).send({ message: err.message });
        const error = new BadRequestError(
          "Некорректные данные при регистрации"
        );
        next(error);
      } else {
        next(err);
      }
    })
    .then((user) =>
      res.send({
        message: `Пользователь ${user.email} успешно зарегистрирован`,
      })
    )
    .catch((err) => {
      next(err);
    });
};

// module.exports.getUserById = (req, res, next) => {
//   User.findById(req.params.id)
//     .then((user) => {
//       if (!user) {
//         // res.status(404).send({ message: "Не найден пользователь с таким ID" });
//         const r = new NotFoundError("Не найден пользователь с таким ID");
//         next(r);
//       } else {
//         res.send({ data: user });
//       }
//     })
//     .catch((err) => {
//       if (err.name === "CastError") {
//         const r = new BadRequestError("Неверный формат ID");
//         next(r);
//       }
//       next(err);
//     });
// };

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const owner = req.user._id;

  User.findByIdAndUpdate(owner, { email, name }, { new: true })
    .then((user) => {
      if (!user) {
        const error = new NotFoundError("Не найден пользователь с таким ID");
        next(error);
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        const error = new BadRequestError("Недопустимые символы");
        next(error);
      } else if (err.name === "CastError") {
        const error = new BadRequestError("Неверный формат ID");
        next(error);
      } else if (err.name === "MongoError" || err.code === 11000) {
        const error = new ConflictError("Такой пользователь уже есть");
        next(error);
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        {
          expiresIn: "7d",
        }
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        const error = new NotFoundError("Не найден пользователь с таким ID");
        next(error);
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};
