class ExpiredTokenError extends Error {
  constructor() {
    super(`Expired token`);
    this.name = 'ExpiredTokenError';
    this.statusCode = 400;
    Object.setPrototypeOf(this, ExpiredTokenError.prototype);

  }
}

export default ExpiredTokenError;
