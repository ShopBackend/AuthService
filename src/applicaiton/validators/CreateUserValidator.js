import InvalidEmailError from "./errors/InvalidEmailError.js";
import InvalidPasswordError from "./errors/InvalidPasswordError.js";
import InvalidUserNameError from "./errors/InvalidUserNameError.js";

function validate(userData) {
    if (!userData.username || userData.username.trim() === "" || userData.username.length < 3 || userData.username.length > 12)
        throw new InvalidUserNameError();

    if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email))
        throw new InvalidEmailError();


    if (!userData.password || userData.password.length < 8 || userData.password.length > 20)
        throw new InvalidPasswordError();

    return {
        email: userData.email,
        username: userData.username,
        password: userData.password,
    };

}

export default validate;