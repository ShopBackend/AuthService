import { IUser } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/UserRepository";
import bcrypt from "bcrypt";
import EmailAlreadyExists from "../errors/EmailAlreadyExists";

class CreateUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    private stripId(user: any): Omit<IUser, "id"> {
        const { id, ...rest } = user;
        return rest;
    }

    async execute(userData: Omit<IUser, "id">) {
        const user = this.stripId(userData);

        const existingUser = await this.userRepository.findByEmail(user.email);

        if (existingUser)
            throw new EmailAlreadyExists();


        const hashedPassword = await bcrypt.hash(user.password, 10);
        const hashedUser = {
            ...user,
            password: hashedPassword,
        };

        await this.userRepository.create(hashedUser);
    }
}

export default CreateUser;
