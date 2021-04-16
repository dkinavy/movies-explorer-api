class ForbiddenError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status = 403;
    this.statusCode = 403;
    this.name = "ForbiddenError";
  }
}
module.exports = ForbiddenError;
