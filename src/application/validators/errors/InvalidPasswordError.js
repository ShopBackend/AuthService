class InvalidPasswordError extends Error {
    statusCode;

    constructor(message = 'Password must be at least 8 characters long and maximum 20 characters long.') {
        super(message);
        this.name = 'InvalidPassword';
        this.statusCode = 400;

        Object.setPrototypeOf(this, InvalidPasswordError.prototype);
    }
}
export default InvalidPasswordError;