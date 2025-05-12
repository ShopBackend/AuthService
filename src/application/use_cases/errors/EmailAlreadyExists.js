class EmailAlreadyExists extends Error {
  statusCode;

  constructor(message = 'Email already in use.') {
    super(message);
    this.name = 'EmailAlreadyExists';
    this.statusCode = 400;
    Object.setPrototypeOf(this, EmailAlreadyExists.prototype);

  }
}

export default EmailAlreadyExists;
