import { Principal } from '@dfinity/principal';

export interface Circuit {
	id: number;
	userId: Principal;
	nodeCanisterId: Principal;
	name: string;
	description: string;
	isFavorite: boolean;
	isEnabled: boolean;
	runAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
