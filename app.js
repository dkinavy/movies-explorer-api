const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");
//const { celebrate, Joi, isCelebrateError } = require("celebrate");
const { PORT = 3001 } = process.env;

const app = express();

const corsOptions = {
  // origin: "http://mestoforday.nomoredomains.icu",
  origin: "http://localhost:3000",
  credentials: true,
};

mongoose.connect("mongodb://localhost:27017/bitfilmsdb", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use("*", cors(corsOptions));

//app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Сервер сейчас упадёт");
  }, 0);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
