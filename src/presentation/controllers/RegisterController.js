import UsernameAlreadyInUse from "../../applicaiton/use_cases/errors/UsernameAlreadyInUse.js";
import EmailAlreadyExists from "../../applicaiton/use_cases/errors/EmailAlreadyExists.js";
import InvalidUserNameError from "../../applicaiton/validators/errors/InvalidUserNameError.js";
import InvalidEmailError from "../../applicaiton/validators/errors/InvalidEmailError.js";
import InvalidPasswordError from "../../applicaiton/validators/errors/InvalidPasswordError.js";
import { validationResult } from 'express-validator';


class RegisterController {
    constructor(createUser) {
        this.createUser = createUser;
    }

    async execute(req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        try {
            const { username, email, password } = req.body;
            await this.createUser.execute({ username, email, password });

            res.status(201).json({ message: 'User created successfully' });

        } catch (error) {
            if (this.#isExpectedAuthError(error))
                return res.status(error.statusCode).json({ message: error.message });

            throw error;
        }
    }

    #isExpectedAuthError(error) {
        return (
            error instanceof EmailAlreadyExists || error instanceof UsernameAlreadyInUse ||
            error instanceof InvalidUserNameError || error instanceof InvalidEmailError ||
            error instanceof InvalidPasswordError
        );
    }
}

export default RegisterController;