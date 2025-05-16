class PasswordHashingError  extends Error {
  constructor() {
    super(`Failed to hash password`);
    this.name = 'PasswordHashingError ';
    this.statusCode = 500;
    Object.setPrototypeOf(this, PasswordHashingError .prototype);

  }
}

export default PasswordHashingError;
