import InvalidEmailError from "./errors/InvalidEmailError";
import InvalidPasswordError from "./errors/InvalidPasswordError";
import InvalidUserNameError from "./errors/InvalidUserNameError";

function validate(userData: any): void {
    if (!userData.username || userData.username.trim() === "" || userData.username.length < 3 || userData.username.length > 12)
        throw new InvalidUserNameError();

    if (!userData.email || !/^\S+@\S+\.\S+$/.test(userData.email))
        throw new InvalidEmailError();


    if (!userData.password || userData.password.length < 8 || userData.password.length > 20)
        throw new InvalidPasswordError();

}

export default validate;