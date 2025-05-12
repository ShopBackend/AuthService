import { isValidUUID } from "./utils.js";
import InvalidIdError from "./errors/InvalidIdError.js";

function validate(id) {
    if (!id || id.trim() === "" || !isValidUUID(id))
        throw new InvalidIdError();

}

export default validate;