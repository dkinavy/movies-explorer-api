const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const users = require("./routes/users.js");
const movieRouter = require("./routes/movies.js");
const { login, createUser } = require("./controllers/users");
const auth = require("./middlewares/auth");
const helmet = require("helmet");
const limiter = require("./middlewares/rateLimit");
const cors = require("cors");
const bodyParser = require("body-parser");
const { errors, celebrate, Joi, isCelebrateError } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const app = express();
const { PORT = 3001, MONGO_ADRESS, NODE_ENV } = process.env;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://api.movie-for-day.nomoredomains.club",
    "http://movie-for-day.nomoredomains.club",
  ],
  credentials: true,
};

mongoose.connect(
  NODE_ENV === "production"
    ? MONGO_ADRESS
    : "mongodb://localhost:27017/bitfilmsdb",
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);

app.use("*", cors());

app.use(requestLogger); // подключаем логгер запросов
app.use(helmet());
app.use(limiter);

app.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
    }),
  }),
  login
);
app.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(2),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  createUser
);

// Все что ниже потребует авторизацию
app.use(auth);
app.use("/", users);
app.use("/", movieRouter);

app.use(errorLogger); // подключаем логгер ошибок

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  if (err.kind === "ObjectId") {
    res.status(400).send({
      message: "Неверно переданы данные",
    });
  } else {
    res.status(statusCode).send({
      message: statusCode === 500 ? message : message,
    });
  }
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
