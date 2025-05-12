class InvalidAuthentication extends Error {
  constructor() {
      super('Email or password are incorrect');
      this.name = 'InvalidAuthentication';
      this.statusCode = 400;

      Object.setPrototypeOf(this, InvalidAuthentication.prototype);
  }
}

export default InvalidAuthentication;
