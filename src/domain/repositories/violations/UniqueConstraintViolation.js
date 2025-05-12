class UniqueConstraintViolation extends Error {
    constructor(fields) {
        super(`Unique constraint failed on fields: ${fields.join(', ')}`);
        this.name = "UniqueConstraintViolation";
        this.fields = fields;
    }
}

export default UniqueConstraintViolation;