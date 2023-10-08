import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError =
	| { NotFound: string }
	| { Unauthorized: string }
	| { AlreadyExists: string }
	| { CanisterFailed: CanisterFailedError };
export interface CanisterFailedError {
	code: RejectionCode;
	message: string;
}
export interface Circuit {
	id: number;
	updated_at: bigint;
	name: string;
	created_at: bigint;
	user_id: Principal;
}
export type RejectionCode =
	| { NoError: null }
	| { CanisterError: null }
	| { SysTransient: null }
	| { DestinationInvalid: null }
	| { Unknown: null }
	| { SysFatal: null }
	| { CanisterReject: null };
export type Result = { Ok: Array<Circuit> } | { Err: ApiError };
export interface _SERVICE {
	get_user_circuits: ActorMethod<[], Result>;
}

export const idlFactory = ({ IDL }) => {
	const Circuit = IDL.Record({
		id: IDL.Nat32,
		updated_at: IDL.Nat64,
		name: IDL.Text,
		created_at: IDL.Nat64,
		user_id: IDL.Principal
	});
	const RejectionCode = IDL.Variant({
		NoError: IDL.Null,
		CanisterError: IDL.Null,
		SysTransient: IDL.Null,
		DestinationInvalid: IDL.Null,
		Unknown: IDL.Null,
		SysFatal: IDL.Null,
		CanisterReject: IDL.Null
	});
	const CanisterFailedError = IDL.Record({
		code: RejectionCode,
		message: IDL.Text
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text,
		CanisterFailed: CanisterFailedError
	});
	const Result = IDL.Variant({ Ok: IDL.Vec(Circuit), Err: ApiError });
	return IDL.Service({
		get_user_circuits: IDL.Func([], [Result], ['query'])
	});
};
