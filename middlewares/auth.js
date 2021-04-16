const jwt = require("jsonwebtoken");
const AuthorizationError = require("../errors/AuthorizationError");

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, _res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AuthorizationError("Необходима авторизация..");
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(
      token,
      `${NODE_ENV === "production" ? JWT_SECRET : "some-secret-key"}`
    );
  } catch (err) {
    throw new AuthorizationError("Невалидный токен..");
  }

  req.user = payload;
  next();
};

module.exports = auth;
