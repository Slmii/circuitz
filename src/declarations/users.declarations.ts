/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { NotFound: string } | { Unauthorized: string } | { AlreadyExists: string };
export type Result = { Ok: User } | { Err: ApiError };
export interface User {
	circuits: Uint32Array | number[];
	username: [] | [string];
	created_at: bigint;
	user_id: Principal;
}
export interface _SERVICE {
	create_user: ActorMethod<[[] | [string]], Result>;
	get_user: ActorMethod<[], Result>;
}

export const idlFactory = ({ IDL }: any) => {
	const User = IDL.Record({
		circuits: IDL.Vec(IDL.Nat32),
		username: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text
	});
	const Result = IDL.Variant({ Ok: User, Err: ApiError });
	return IDL.Service({
		create_user: IDL.Func([IDL.Opt(IDL.Text)], [Result], []),
		get_user: IDL.Func([], [Result], ['query'])
	});
};
