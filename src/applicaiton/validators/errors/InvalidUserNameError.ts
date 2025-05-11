
class InvalidUserNameError extends Error {
    statusCode: number;

    constructor(message: string = 'Username must be at least 3 characters long and maximum 12 characters long.') {
        super(message);
        this.name = 'InvalidUserNameError';
        this.statusCode = 400;

        Object.setPrototypeOf(this, InvalidUserNameError.prototype);
    }
}


export default InvalidUserNameError;
