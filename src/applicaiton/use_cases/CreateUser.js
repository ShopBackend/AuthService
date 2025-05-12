import EmailAlreadyExists from "./errors/EmailAlreadyExists.js";
import validate from "../validators/CreateUserValidator.js";

class CreateUser {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    async execute(user) {
        validate(user);
        const existingUser = await this.userRepository.findByEmail(user.email);

        if (existingUser)
            throw new EmailAlreadyExists();


        const hashedPassword = await passwordService.hashedPassword(user.password);
        const hashedUser = {
            ...user,
            password: hashedPassword,
        };

        await this.userRepository.create(hashedUser);
    }
}

export default CreateUser;
