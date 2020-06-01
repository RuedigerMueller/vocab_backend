import { User } from "./user.entity";
import { initialUserRepository, addUser } from "./user.test.data";

export class UserRepositoryMock {
    private _repository: ReadonlyArray<User> = [];
  
    constructor() {
      this._repository = this._repository.concat(initialUserRepository);
    }

    async save(user: User): Promise<User> {
        user.id = addUser.id;
        this._repository = this._repository.concat(user);
        return user;
    }

    async findOne(criteria: string): Promise<User> {
        if (criteria.search('@')) {
            return this._repository.find(user => user.email === criteria);
        } else {
            return this._repository.find(user => user.id === parseInt(criteria));
        }
    }
}