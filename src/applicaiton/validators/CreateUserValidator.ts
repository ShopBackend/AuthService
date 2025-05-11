import { Omit } from "utility-types"; // if not available, just define Omit manually
import { IUser } from "../../domain/entities/user";

export class UserValidator {
    static validate(user: Omit<IUser, "id">): void {
        if (!user.username || user.username.trim() === "") {
            throw new Error("Username is required.");
        }

        if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) {
            throw new Error("A valid email is required.");
        }

        if (!user.password || user.password.length < 8) {
            throw new Error("Password must be at least 8 characters long.");
        }
    }
}
