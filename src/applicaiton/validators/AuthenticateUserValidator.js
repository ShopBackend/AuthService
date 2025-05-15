import InvalidEmailError from "./errors/InvalidEmailError.js";
import InvalidPasswordError from "./errors/InvalidPasswordError.js";

function validate(userData) {
    if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email) || userData.email === userData.email.toLowerCase())
        throw new InvalidEmailError();

    if (!userData.password || userData.password.length < 8 || userData.password.length > 20)
        throw new InvalidPasswordError();
    
    return {
        email: userData.email,
        password: userData.password,
    };
}

export default validate;