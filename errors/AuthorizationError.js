class AuthorizationError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status = 401;
    this.name = "AuthorizationError";
    this.statusCode = 401;
  }
}

module.exports = AuthorizationError;
