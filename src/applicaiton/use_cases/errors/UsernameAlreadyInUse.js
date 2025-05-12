class UsernameAlreadyInUse extends Error {
  constructor(username) {
    super(`Username ${username} is already in use`);
    this.name = 'UsernameAlreadyInUse';
    this.statusCode = 400;
    Object.setPrototypeOf(this, UsernameAlreadyInUse.prototype);

  }
}

export default UsernameAlreadyInUse;
