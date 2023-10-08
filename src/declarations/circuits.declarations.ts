/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { NotFound: string } | { Unauthorized: string } | { AlreadyExists: string };
export interface Circuit {
	id: number;
	updated_at: bigint;
	name: string;
	description: [] | [string];
	created_at: bigint;
	user_id: Principal;
	is_favorite: boolean;
}
export interface PostCircuit {
	name: string;
	description: [] | [string];
}
export type Result = { Ok: Circuit } | { Err: ApiError };
export type Result_1 = { Ok: Array<Circuit> } | { Err: ApiError };
export interface _SERVICE {
	add_circuit: ActorMethod<[PostCircuit], Result>;
	get_user_circuits: ActorMethod<[], Result_1>;
}

export const idlFactory = ({ IDL }: any) => {
	const PostCircuit = IDL.Record({
		name: IDL.Text,
		description: IDL.Opt(IDL.Text)
	});
	const Circuit = IDL.Record({
		id: IDL.Nat32,
		updated_at: IDL.Nat64,
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		is_favorite: IDL.Bool
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text
	});
	const Result = IDL.Variant({ Ok: Circuit, Err: ApiError });
	const Result_1 = IDL.Variant({ Ok: IDL.Vec(Circuit), Err: ApiError });
	return IDL.Service({
		add_circuit: IDL.Func([PostCircuit], [Result], []),
		get_user_circuits: IDL.Func([], [Result_1], ['query'])
	});
};
