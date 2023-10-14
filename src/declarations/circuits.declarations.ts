import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { NotFound: string } | { Unauthorized: string } | { AlreadyExists: string };
export interface Circuit {
	id: number;
	updated_at: bigint;
	run_at: [] | [bigint];
	name: string;
	is_enabled: boolean;
	description: [] | [string];
	created_at: bigint;
	user_id: Principal;
	is_favorite: boolean;
	node_canister_id: Principal;
	is_running: boolean;
}
export interface PostCircuit {
	name: string;
	description: [] | [string];
}
export type Result = { Ok: Circuit } | { Err: ApiError };
export type Result_1 = { Ok: Principal } | { Err: ApiError };
export type Result_2 = { Ok: Array<Circuit> } | { Err: ApiError };
export interface _SERVICE {
	add_circuit: ActorMethod<[PostCircuit], Result>;
	disable_circuit: ActorMethod<[number], Result>;
	edit_circuit: ActorMethod<[number, PostCircuit], Result>;
	enable_circuit: ActorMethod<[number], Result>;
	get_circuit: ActorMethod<[number], Result>;
	get_node_canister_id: ActorMethod<[number], Result_1>;
	get_user_circuits: ActorMethod<[], Result_2>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const PostCircuit = IDL.Record({
		name: IDL.Text,
		description: IDL.Opt(IDL.Text)
	});
	const Circuit = IDL.Record({
		id: IDL.Nat32,
		updated_at: IDL.Nat64,
		run_at: IDL.Opt(IDL.Nat64),
		name: IDL.Text,
		is_enabled: IDL.Bool,
		description: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		is_favorite: IDL.Bool,
		node_canister_id: IDL.Principal,
		is_running: IDL.Bool
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text
	});
	const Result = IDL.Variant({ Ok: Circuit, Err: ApiError });
	const Result_1 = IDL.Variant({ Ok: IDL.Principal, Err: ApiError });
	const Result_2 = IDL.Variant({ Ok: IDL.Vec(Circuit), Err: ApiError });
	return IDL.Service({
		add_circuit: IDL.Func([PostCircuit], [Result], []),
		disable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		edit_circuit: IDL.Func([IDL.Nat32, PostCircuit], [Result], []),
		enable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		get_circuit: IDL.Func([IDL.Nat32], [Result], ['query']),
		get_node_canister_id: IDL.Func([IDL.Nat32], [Result_1], ['query']),
		get_user_circuits: IDL.Func([], [Result_2], ['query'])
	});
};
