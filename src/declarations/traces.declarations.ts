import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { NotFound: string } | { Unauthorized: string } | { AlreadyExists: string };
export type Result = { Ok: Array<Trace> } | { Err: ApiError };
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
	code: string;
	created_at: bigint;
	message: string;
}
export type TraceStatus = { Failed: null } | { Success: null } | { Cancelled: null } | { InProgress: null };
export interface _SERVICE {
	get_circuit_traces: ActorMethod<[number], Result>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const TraceStatus = IDL.Variant({
		Failed: IDL.Null,
		Success: IDL.Null,
		Cancelled: IDL.Null,
		InProgress: IDL.Null
	});
	const TraceError = IDL.Record({
		updated_at: IDL.Nat64,
		code: IDL.Text,
		created_at: IDL.Nat64,
		message: IDL.Text
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
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text
	});
	const Result = IDL.Variant({ Ok: IDL.Vec(Trace), Err: ApiError });
	return IDL.Service({
		get_circuit_traces: IDL.Func([IDL.Nat32], [Result], ['query'])
	});
};
