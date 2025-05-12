class InvalidIdError extends Error {
    constructor(message = 'Invalid ID') {
        super(message);
        this.name = 'InvalidId';
        this.statusCode = 400;

        Object.setPrototypeOf(this, InvalidIdError.prototype);
    }
}

export default InvalidIdError;
