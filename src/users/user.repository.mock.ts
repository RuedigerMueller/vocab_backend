import { User } from "./user.entity";
import { initialUserRepository, addUser_1 } from "./user.test.data";

export class UserRepositoryMock {
    private _repository: ReadonlyArray<User> = [];

    constructor() {
        this._repository = this._repository.concat(initialUserRepository);
    }

    getIDfromQuery(query: string): number {
        // { where: { id: '0', username: 'john' } }
        const conditions: string = query['where'];
        return parseInt(conditions['id']);
    }

    geteMailfromQuery(query: string): string {
        // { where: { id: '0', username: 'john' } }
        const conditions: string = query['where'];
        return conditions['email'];
    }

    async save(user: User): Promise<User> {
        user.id = addUser_1.id;
        this._repository = this._repository.concat(user);
        return user;
    }

    async findOne(criteria: string): Promise<User> {
        const id: number = this.getIDfromQuery(criteria);
        const email: string = this.geteMailfromQuery(criteria);
        if (email) {
            return this._repository.find(user => user.email === email);
        } else if (id) {
            return this._repository.find(user => user.id === id);
        } else {
            return null;
        }
    }
}