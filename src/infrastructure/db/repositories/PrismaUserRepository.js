import { User } from '../../../domain/entities/user.js';
import UniqueConstraintViolation from '../../../domain/repositories/violations/UniqueConstraintViolation.js';

class PrismaUserRepository {
    constructor(prisma) {
        this.prisma = prisma;
    }

    async create(data) {
        try {
            const user = await this.prisma.user.create({
                data: {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                },
            });

            return User.fromObject(user);
        }

        catch (err) {
            const isUniqueConstraintError = err.code === 'P2002';
            if (isUniqueConstraintError)
                throw new UniqueConstraintViolation(err.meta?.target || []);

            throw err;
        }
    }

    async findByEmail(email) {
        return await this.prisma.user.findUnique({ where: { email: email } });
    }

    async findByUsername(username) {
        return await this.prisma.user.findUnique({ where: { username: username } });
    }

    async update(id, data) {
        const user = await this.prisma.user.update({
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
        await this.prisma.user.delete({
            where: { id: id },
        });
    }
}

export default PrismaUserRepository;
