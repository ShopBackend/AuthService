import EmailAlreadyExists from "./errors/EmailAlreadyExists.js";
import UsernameAlreadyInUse from "./errors/UsernameAlreadyInUse.js";
import validate from "../validators/CreateUserValidator.js";

class CreateUser {
    constructor(userRepository, passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    async execute(userData) {
        userData = validate(userData);

        const hashedPassword = await this.passwordService.hashPassword(userData.password);
        const hashedUser = {
            ...userData,
            password: hashedPassword,
        };

        try {
            return await this.userRepository.create(hashedUser);
        } catch (err) {
            if (err instanceof UniqueConstraintViolation) {
                if (err.fields.includes('email')) throw new EmailAlreadyExists(userData.email);
                if (err.fields.includes('username')) throw new UsernameAlreadyInUse(user.username);
            }
            throw err;
        }
    }

}

export default CreateUser;
