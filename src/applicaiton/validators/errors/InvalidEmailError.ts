class InvalidEmailError extends Error {
    statusCode: number;

    constructor(message: string = 'A valid email is required.') {
        super(message);
        this.name = 'InvalidEmailError';
        this.statusCode = 400;

        Object.setPrototypeOf(this, InvalidEmailError.prototype);
    }
}

export default InvalidEmailError;
