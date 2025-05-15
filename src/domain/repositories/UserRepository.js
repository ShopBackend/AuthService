class UserRepository {
    async create(data) {
        throw new Error('Method "create" must be implemented.');
    }

    async findByEmail(email) {
        throw new Error('Method "findByEmail" must be implemented.');
    }

    async findByUsername(username) {
        throw new Error('Method "findByUsername" must be implemented.');
    }

    async update(id, data) {
        throw new Error('Method "update" must be implemented.');
    }

    async delete(id) {
        throw new Error('Method "delete" must be implemented.');
    }
}

export { UserRepository };
