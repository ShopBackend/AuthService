import AtLeastOne from "../../shared/utility-types";
import { User, IUser } from "../entities/user";

type UpdateUserData = AtLeastOne<Omit<IUser, "id">>;

abstract class UserRepository {
    abstract create(data: Omit<IUser, 'id'>): Promise<User>;
    abstract findByEmail(email: string): Promise<User | null>;
    abstract update(id: string, data: UpdateUserData): Promise<User>;
    abstract delete(id: string): Promise<void>;
}

export { UserRepository, UpdateUserData };