class InvalidTokenError extends Error {
  constructor() {
    super(`Invalid token`);
    this.name = 'InvalidToken';
    this.statusCode = 400;
    Object.setPrototypeOf(this, InvalidTokenError.prototype);

  }
}

export default InvalidTokenError;
