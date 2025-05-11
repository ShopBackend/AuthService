import { IUser } from "../../domain/entities/user";
import { UserRepository } from "../../domain/repositories/UserRepository";
import bcrypt from "bcrypt";
import EmailAlreadyExists from "./errors/EmailAlreadyExists";
import validate from "../validators/CreateUserValidator";

class CreateUser {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async execute(user: Omit<IUser, "id">) {
        validate(user);
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
