class UsernameAlreadyInUse extends Error {
  statusCode;

  constructor(message = 'Username already in use.') {
    super(message);
    this.name = 'UsernameAlreadyInUse';
    this.statusCode = 400;
    Object.setPrototypeOf(this, UsernameAlreadyInUse.prototype);

  }
}

export default UsernameAlreadyInUse;
