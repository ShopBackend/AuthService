import InvalidEmailError from "./errors/InvalidEmailError";
import InvalidPasswordError from "./errors/InvalidPasswordError";

function validate(userData) {
    if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email))
        throw new InvalidEmailError();

    if (!userData.password || userData.password.length < 8 || userData.password.length > 20)
        throw new InvalidPasswordError();

}

export default validate;