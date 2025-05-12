class EmailAlreadyExists extends Error {
  constructor(email) {
    super(`Email ${email} already exists`);
    this.name = 'EmailAlreadyExists';
    this.statusCode = 400;
    Object.setPrototypeOf(this, EmailAlreadyExists.prototype);

  }
}

export default EmailAlreadyExists;
