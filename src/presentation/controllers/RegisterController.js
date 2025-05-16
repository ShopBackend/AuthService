import UsernameAlreadyInUse from "../../applicaiton/use_cases/errors/UsernameAlreadyInUse.js";
import EmailAlreadyExists from "../../applicaiton/use_cases/errors/EmailAlreadyExists.js";
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
            email = email.toLowerCase();

            await this.createUser.execute({ username, email, password });
            res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            if (error instanceof EmailAlreadyExists || error instanceof UsernameAlreadyInUse)
                return res.status(error.statusCode).json({ message: error.message });
            throw error;
        }

    }
}

export default RegisterController;