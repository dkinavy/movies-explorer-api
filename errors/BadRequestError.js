class BadRequestError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status = 400;
    this.statusCode = 400;

    //this.name = "BadRequestError";
  }
}
module.exports = BadRequestError;
