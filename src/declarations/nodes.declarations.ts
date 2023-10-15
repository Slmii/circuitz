import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError =
	| { NotFound: string }
	| { Unauthorized: string }
	| { AlreadyExists: string }
	| { InterCanister: string };
export type Arg =
	| { BigInt: bigint }
	| { String: string }
	| { Object: Array<[string, Arg]> }
	| { Boolean: boolean }
	| { Principal: Principal }
	| { Array: Vec }
	| { Number: number };
export interface Canister {
	name: string;
	description: [] | [string];
	sample_data: [] | [string];
	verification_type: VerificationType;
}
export type Condition = { Is: null } | { Not: null };
export interface ConditionGroup {
	field: string;
	condition_group_type: [] | [ConditionGroupType];
	value: string;
	operator: Operator;
	condition: Condition;
}
export type ConditionGroupType = { Or: null } | { And: null };
export interface CustomPinLogic {
	function: [] | [string];
	script: [] | [string];
}
export interface HttpRequest {
	url: string;
	method: HttpRequestMethod;
	name: string;
	description: [] | [string];
	headers: Array<[string, string]>;
	request_body: [] | [string];
}
export type HttpRequestMethod = { GET: null } | { POST: null };
export interface LookupCanister {
	method: string;
	args: Array<Arg>;
	name: string;
	description: [] | [string];
	canister: Principal;
}
export interface LookupTransformPin {
	output: string;
	input: string;
}
export interface Mapper {
	output: string;
	interface: string;
	input: string;
}
export interface Node {
	id: number;
	pin: Array<Pin>;
	updated_at: bigint;
	node_type: NodeType;
	order: number;
	is_enabled: boolean;
	created_at: bigint;
	user_id: Principal;
	is_error: boolean;
	is_running: boolean;
	circuit_id: number;
}
export type NodeType =
	| { LookupCanister: LookupCanister }
	| { HttpRequest: HttpRequest }
	| { Transformer: LookupTransformPin }
	| { Canister: Canister }
	| { Ouput: Ouput }
	| { LookupHttpRequest: HttpRequest }
	| { Mapper: Mapper };
export type Operator =
	| { In: null }
	| { Equal: null }
	| { NotIn: null }
	| { LessThanOrEqual: null }
	| { GreaterThan: null }
	| { LessThan: null }
	| { GreaterThanOrEqual: null }
	| { NotEqual: null };
export interface Ouput {
	method: string;
	name: string;
	description: [] | [string];
	canister: Principal;
}
export interface Pin {
	pin_type: PinType;
	order: number;
}
export type PinType =
	| { LookupTransformPin: LookupTransformPin }
	| { PostResponsePin: CustomPinLogic }
	| { FilterPin: Array<ConditionGroup> }
	| { MapperPin: Mapper }
	| { PrePin: CustomPinLogic };
export type Result = { Ok: Node } | { Err: ApiError };
export type Result_1 = { Ok: [Principal, Array<Node>] } | { Err: ApiError };
export type Result_2 = { Ok: string } | { Err: ApiError };
export interface Token {
	field: string;
	token: string;
}
export interface Transformer {
	output: string;
	input: string;
}
export type Vec = Array<
	| { BigInt: bigint }
	| { String: string }
	| { Object: Array<[string, Arg]> }
	| { Boolean: boolean }
	| { Principal: Principal }
	| { Array: Vec }
	| { Number: number }
>;
export type VerificationType = { None: null } | { Token: Token } | { Whitelist: Array<Principal> };
export interface _SERVICE {
	add_node: ActorMethod<[number, NodeType], Result>;
	edit_node: ActorMethod<[number, NodeType], Result>;
	get_circuit_nodes: ActorMethod<[number], Result_1>;
	preview_lookup_request: ActorMethod<[LookupCanister], Result_2>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const Arg = IDL.Rec();
	const Vec = IDL.Rec();
	Vec.fill(
		IDL.Vec(
			IDL.Variant({
				BigInt: IDL.Nat64,
				String: IDL.Text,
				Object: IDL.Vec(IDL.Tuple(IDL.Text, Arg)),
				Boolean: IDL.Bool,
				Principal: IDL.Principal,
				Array: Vec,
				Number: IDL.Nat32
			})
		)
	);
	Arg.fill(
		IDL.Variant({
			BigInt: IDL.Nat64,
			String: IDL.Text,
			Object: IDL.Vec(IDL.Tuple(IDL.Text, Arg)),
			Boolean: IDL.Bool,
			Principal: IDL.Principal,
			Array: Vec,
			Number: IDL.Nat32
		})
	);
	const LookupCanister = IDL.Record({
		method: IDL.Text,
		args: IDL.Vec(Arg),
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		canister: IDL.Principal
	});
	const HttpRequestMethod = IDL.Variant({
		GET: IDL.Null,
		POST: IDL.Null
	});
	const HttpRequest = IDL.Record({
		url: IDL.Text,
		method: HttpRequestMethod,
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text)),
		request_body: IDL.Opt(IDL.Text)
	});
	const LookupTransformPin = IDL.Record({
		output: IDL.Text,
		input: IDL.Text
	});
	const Token = IDL.Record({ field: IDL.Text, token: IDL.Text });
	const VerificationType = IDL.Variant({
		None: IDL.Null,
		Token: Token,
		Whitelist: IDL.Vec(IDL.Principal)
	});
	const Canister = IDL.Record({
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		sample_data: IDL.Opt(IDL.Text),
		verification_type: VerificationType
	});
	const Ouput = IDL.Record({
		method: IDL.Text,
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		canister: IDL.Principal
	});
	const Mapper = IDL.Record({
		output: IDL.Text,
		interface: IDL.Text,
		input: IDL.Text
	});
	const NodeType = IDL.Variant({
		LookupCanister: LookupCanister,
		HttpRequest: HttpRequest,
		Transformer: LookupTransformPin,
		Canister: Canister,
		Ouput: Ouput,
		LookupHttpRequest: HttpRequest,
		Mapper: Mapper
	});
	const CustomPinLogic = IDL.Record({
		function: IDL.Opt(IDL.Text),
		script: IDL.Opt(IDL.Text)
	});
	const ConditionGroupType = IDL.Variant({ Or: IDL.Null, And: IDL.Null });
	const Operator = IDL.Variant({
		In: IDL.Null,
		Equal: IDL.Null,
		NotIn: IDL.Null,
		LessThanOrEqual: IDL.Null,
		GreaterThan: IDL.Null,
		LessThan: IDL.Null,
		GreaterThanOrEqual: IDL.Null,
		NotEqual: IDL.Null
	});
	const Condition = IDL.Variant({ Is: IDL.Null, Not: IDL.Null });
	const ConditionGroup = IDL.Record({
		field: IDL.Text,
		condition_group_type: IDL.Opt(ConditionGroupType),
		value: IDL.Text,
		operator: Operator,
		condition: Condition
	});
	const PinType = IDL.Variant({
		LookupTransformPin: LookupTransformPin,
		PostResponsePin: CustomPinLogic,
		FilterPin: IDL.Vec(ConditionGroup),
		MapperPin: Mapper,
		PrePin: CustomPinLogic
	});
	const Pin = IDL.Record({ pin_type: PinType, order: IDL.Nat32 });
	const Node = IDL.Record({
		id: IDL.Nat32,
		pin: IDL.Vec(Pin),
		updated_at: IDL.Nat64,
		node_type: NodeType,
		order: IDL.Nat32,
		is_enabled: IDL.Bool,
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		is_error: IDL.Bool,
		is_running: IDL.Bool,
		circuit_id: IDL.Nat32
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text,
		InterCanister: IDL.Text
	});
	const Result = IDL.Variant({ Ok: Node, Err: ApiError });
	const Result_1 = IDL.Variant({
		Ok: IDL.Tuple(IDL.Principal, IDL.Vec(Node)),
		Err: ApiError
	});
	const Result_2 = IDL.Variant({ Ok: IDL.Text, Err: ApiError });
	return IDL.Service({
		add_node: IDL.Func([IDL.Nat32, NodeType], [Result], []),
		edit_node: IDL.Func([IDL.Nat32, NodeType], [Result], []),
		get_circuit_nodes: IDL.Func([IDL.Nat32], [Result_1], ['query']),
		preview_lookup_request: IDL.Func([LookupCanister], [Result_2], [])
	});
};
