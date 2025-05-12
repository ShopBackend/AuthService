import { prisma } from '../../../shared/PrismaDbConfig.js';
import { User } from '../../../domain/entities/user.js';

class SqlUserRepository {
    async create(data) {
        const user = await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
            },
        });

        return User.fromObject(user);
    }

    async findByEmail(email) {
        return await prisma.user.findUnique({ where: { email: email } });
    }

    async update(id, data) {
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

    async delete(id) {
        await prisma.user.delete({
            where: { id: id },
        });
    }
}

export default SqlUserRepository;
