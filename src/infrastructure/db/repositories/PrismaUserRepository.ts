import {UserRepository, UpdateUserData} from '../../../domain/repositories/UserRepository';
import { prisma } from '../../../shared/PrismaDbConfig';
import { User, IUser } from '../../../domain/entities/user';

class SqlUserRepository extends UserRepository {
    async create(data: Omit<IUser, 'id'>) {
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });

        return User.fromObject(user);
    }

    async findByEmail(email: string) {
        return await prisma.user.findUnique({ where: { email: email } });
    }

    async update(id: string, data: UpdateUserData) {
        const user = await prisma.user.update({
            where: { id: id },
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });

        return User.fromObject(user);
    }

    async delete(id: string) {
        await prisma.user.delete({
            where: { id: id },
        });
    }
}

export default SqlUserRepository;