import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError =
	| { NotFound: string }
	| { Unauthorized: string }
	| { AlreadyExists: string }
	| { InterCanister: string };
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
export type Result_1 = { Ok: User } | { Err: ApiError };
export type Result_2 = { Ok: Array<Trace> } | { Err: ApiError };
export type Result_3 = { Ok: Principal } | { Err: ApiError };
export type Result_4 = { Ok: Array<Circuit> } | { Err: ApiError };
export type Result_5 = { Ok: Array<User> } | { Err: ApiError };
export interface Trace {
	id: number;
	status: TraceStatus;
	updated_at: bigint;
	duration: number;
	node_id: number;
	data: string;
	errors: Array<TraceError>;
	created_at: bigint;
	user_id: Principal;
	completed_at: bigint;
	started_at: bigint;
	circuit_id: number;
}
export interface TraceError {
	updated_at: bigint;
	source: string;
	code: string;
	created_at: bigint;
	message: string;
	resolved_at: [] | [bigint];
}
export type TraceStatus = { Failed: null } | { Success: null } | { Cancelled: null } | { InProgress: null };
export interface User {
	circuits: Uint32Array | number[];
	username: [] | [string];
	created_at: bigint;
	user_id: Principal;
}
export interface _SERVICE {
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	add_circuit: ActorMethod<[PostCircuit], Result>;
	create_user: ActorMethod<[[] | [string]], Result_1>;
	disable_circuit: ActorMethod<[number], Result>;
	edit_circuit: ActorMethod<[number, PostCircuit], Result>;
	enable_circuit: ActorMethod<[number], Result>;
	get_circuit: ActorMethod<[number], Result>;
	get_circuit_traces: ActorMethod<[number], Result_2>;
	get_node_canister_id: ActorMethod<[number], Result_3>;
	get_user: ActorMethod<[], Result_1>;
	get_user_circuits: ActorMethod<[], Result_4>;
	get_users: ActorMethod<[], Result_5>;
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
		AlreadyExists: IDL.Text,
		InterCanister: IDL.Text
	});
	const Result = IDL.Variant({ Ok: Circuit, Err: ApiError });
	const User = IDL.Record({
		circuits: IDL.Vec(IDL.Nat32),
		username: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal
	});
	const Result_1 = IDL.Variant({ Ok: User, Err: ApiError });
	const TraceStatus = IDL.Variant({
		Failed: IDL.Null,
		Success: IDL.Null,
		Cancelled: IDL.Null,
		InProgress: IDL.Null
	});
	const TraceError = IDL.Record({
		updated_at: IDL.Nat64,
		source: IDL.Text,
		code: IDL.Text,
		created_at: IDL.Nat64,
		message: IDL.Text,
		resolved_at: IDL.Opt(IDL.Nat64)
	});
	const Trace = IDL.Record({
		id: IDL.Nat32,
		status: TraceStatus,
		updated_at: IDL.Nat64,
		duration: IDL.Nat32,
		node_id: IDL.Nat32,
		data: IDL.Text,
		errors: IDL.Vec(TraceError),
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		completed_at: IDL.Nat64,
		started_at: IDL.Nat64,
		circuit_id: IDL.Nat32
	});
	const Result_2 = IDL.Variant({ Ok: IDL.Vec(Trace), Err: ApiError });
	const Result_3 = IDL.Variant({ Ok: IDL.Principal, Err: ApiError });
	const Result_4 = IDL.Variant({ Ok: IDL.Vec(Circuit), Err: ApiError });
	const Result_5 = IDL.Variant({ Ok: IDL.Vec(User), Err: ApiError });
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
		add_circuit: IDL.Func([PostCircuit], [Result], []),
		create_user: IDL.Func([IDL.Opt(IDL.Text)], [Result_1], []),
		disable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		edit_circuit: IDL.Func([IDL.Nat32, PostCircuit], [Result], []),
		enable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		get_circuit: IDL.Func([IDL.Nat32], [Result], ['query']),
		get_circuit_traces: IDL.Func([IDL.Nat32], [Result_2], ['query']),
		get_node_canister_id: IDL.Func([IDL.Nat32], [Result_3], ['query']),
		get_user: IDL.Func([], [Result_1], ['query']),
		get_user_circuits: IDL.Func([], [Result_4], ['query']),
		get_users: IDL.Func([], [Result_5], ['query'])
	});
};
