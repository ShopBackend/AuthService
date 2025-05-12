import { prisma } from '../../../shared/PrismaDbConfig.js';
import { User } from '../../../domain/entities/user.js';
import UniqueConstraintViolation from '../../../domain/repositories/violations/UniqueConstraintViolation.js';

class PrismaUserRepository {
    async create(data) {
        try {
            const user = await prisma.user.create({
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
        return await prisma.user.findUnique({ where: { email: email } });
    }

    async findByUsername(username) {
        return await prisma.user.findUnique({ where: { username: username } });
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

export default PrismaUserRepository;
