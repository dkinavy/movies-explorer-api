class ConflictError extends Error {
  constructor(message) {
    super();
    this.message = message;
    this.status = 409;
    this.statusCode = 409;
    this.name = "ConflictError";
  }
}

module.exports = ConflictError;
