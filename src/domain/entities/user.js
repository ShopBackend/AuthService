class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static fromValues(userId, username, email, password) {
        return new User(userId, username, email, password);
    }

    static fromObject(data) {
        return new User(data.id, data.username, data.email, data.password);
    }
}

export { User };
