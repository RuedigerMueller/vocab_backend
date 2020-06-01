import { User } from "./user.entity";


function createUser(
    id: number,
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    email: string,
  ): User {
    const user: User = new User();
    user.id = id;
    user.username = username;
    user.password = password;
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    return user;
  }

  export let initialUserRepository: ReadonlyArray<User> = [];

  initialUserRepository = initialUserRepository.concat(
    createUser(1, 'john', 'changeme', 'John', 'Miller', 'john@example.com'),
  );
  initialUserRepository = initialUserRepository.concat(
    createUser(2, 'chris', 'secret', 'Chris', 'Myres', 'chris@example.com'),
  );
  initialUserRepository = initialUserRepository.concat(
    createUser(3, 'maria', 'guess', 'Maria', 'Muller', 'maria@example.com'),
  );

  export const addUser: User = createUser(
    4,
    'paula',
    'special',
    'Paula',
    'Paulsen',
    'paula@example.com'
  );