import { User } from 'declarations/users';

export abstract class Auth {
	private static user: User | undefined = undefined;

	static getUser() {
		return this.user;
	}

	static setUser(user?: User) {
		this.user = user;
	}
}
