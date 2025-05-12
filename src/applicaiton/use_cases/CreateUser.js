import bcrypt from "bcrypt";
import EmailAlreadyExists from "./errors/EmailAlreadyExists.js";
import validate from "../validators/CreateUserValidator.js";

class CreateUser {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(user) {
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
