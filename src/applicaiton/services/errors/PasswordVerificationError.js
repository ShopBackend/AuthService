class PasswordVerificationError extends Error {
  constructor() {
    super(`Failed to verify password`);
    this.name = 'PasswordVerificationError ';
    this.statusCode = 500;
    Object.setPrototypeOf(this, PasswordVerificationError.prototype);

  }
}

export default PasswordVerificationError;
