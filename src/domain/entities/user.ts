interface IUser {
    id: string;
    username: string;
    email: string;
    password: string;
}

class User implements IUser {
    id: string;
    username: string;
    email: string;
    password: string;

    private constructor(id: string, username: string, email: string, password: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static fromValues(userId: string, username: string, email: string, password: string): User {
        return new User(userId, username, email, password);
    }

    static fromObject(data: IUser): User {
        return new User(data.id, data.username, data.email, data.password);
    }
}

export { User, IUser };
