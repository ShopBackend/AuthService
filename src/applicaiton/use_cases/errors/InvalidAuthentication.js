class InvalidAuthentication extends Error {
  statusCode;

  constructor(message = 'Email or password are incorrect') {
      super(message);
      this.name = 'InvalidAuthentication';
      this.statusCode = 400;

      Object.setPrototypeOf(this, InvalidAuthentication.prototype);
  }
}

export default InvalidAuthentication;
