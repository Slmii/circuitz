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
	is_running: boolean;
}
export type Condition = { Is: null } | { Not: null };
export type ConditionGroup = { Or: null } | { And: null };
export interface CustomPinLogic {
	function: [] | [string];
	script: [] | [string];
}
export type DataType = { BigInt: null } | { String: null } | { Boolean: null } | { Principal: null } | { Number: null };
export interface FilterPin {
	condition_group: [] | [ConditionGroup];
	sample_data: [] | [string];
	rules: Array<Rule>;
	condition: Condition;
}
export interface HttpHeader {
	value: string;
	name: string;
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
export interface HttpResponse {
	status: bigint;
	body: Uint8Array | number[];
	headers: Array<HttpHeader>;
}
export interface LookupCanister {
	method: string;
	args: Array<Arg>;
	name: string;
	description: [] | [string];
	sample_data: [] | [string];
	cycles: bigint;
	canister: Principal;
}
export interface LookupTransformPin {
	output: string;
	input: string;
}
export interface MapperPin {
	sample_data: [] | [string];
	fields: Array<[string, string]>;
}
export interface Node {
	id: number;
	updated_at: bigint;
	node_type: NodeType;
	order: number;
	pins: Array<Pin>;
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
	| { Output: Output }
	| { Canister: Canister }
	| { LookupHttpRequest: HttpRequest };
export interface Operand {
	operand_type: OperandType;
	data_type: DataType;
}
export type OperandType = { Field: null } | { Value: null };
export type Operator =
	| { Equal: null }
	| { Contains: null }
	| { LessThanOrEqual: null }
	| { GreaterThan: null }
	| { LessThan: null }
	| { GreaterThanOrEqual: null }
	| { NotEqual: null };
export interface Output {
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
	| { FilterPin: FilterPin }
	| { MapperPin: MapperPin }
	| { PrePin: CustomPinLogic }
	| { PostPin: CustomPinLogic }
	| { LookupFilterPin: FilterPin };
export interface PostCircuit {
	name: string;
	description: [] | [string];
}
export type Result = { Ok: Circuit } | { Err: ApiError };
export type Result_1 = { Ok: Node } | { Err: ApiError };
export type Result_2 = { Ok: User } | { Err: ApiError };
export type Result_3 = { Ok: [Principal, Array<Node>] } | { Err: ApiError };
export type Result_4 = { Ok: Array<Trace> } | { Err: ApiError };
export type Result_5 = { Ok: Array<Circuit> } | { Err: ApiError };
export type Result_6 = { Ok: Array<User> } | { Err: ApiError };
export type Result_7 = { Ok: string } | { Err: ApiError };
export interface Rule {
	field: string;
	value: string;
	operand: Operand;
	operator: Operator;
}
export interface Token {
	field: string;
	token: string;
}
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
export interface TransformArgs {
	context: Uint8Array | number[];
	response: HttpResponse;
}
export interface User {
	circuits: Uint32Array | number[];
	username: [] | [string];
	created_at: bigint;
	user_id: Principal;
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
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	add_circuit: ActorMethod<[PostCircuit], Result>;
	add_node: ActorMethod<[number, NodeType], Result_1>;
	add_pin: ActorMethod<[number, Pin], Result_1>;
	create_user: ActorMethod<[[] | [string]], Result_2>;
	delete_node: ActorMethod<[number], Result_1>;
	delete_pin: ActorMethod<[number, Pin], Result_1>;
	disable_circuit: ActorMethod<[number], Result>;
	disable_node: ActorMethod<[number], Result_1>;
	edit_circuit: ActorMethod<[number, PostCircuit], Result>;
	edit_node: ActorMethod<[number, NodeType], Result_1>;
	edit_order: ActorMethod<[number, number], Result_1>;
	edit_pin: ActorMethod<[number, Pin], Result_1>;
	enable_circuit: ActorMethod<[number], Result>;
	enable_node: ActorMethod<[number], Result_1>;
	get_circuit: ActorMethod<[number], Result>;
	get_circuit_node: ActorMethod<[number], Result_1>;
	get_circuit_nodes: ActorMethod<[number], Result_3>;
	get_circuit_traces: ActorMethod<[number], Result_4>;
	get_user: ActorMethod<[], Result_2>;
	get_user_circuits: ActorMethod<[], Result_5>;
	get_users: ActorMethod<[], Result_6>;
	preview_lookup_request: ActorMethod<[LookupCanister], Result_7>;
	transform: ActorMethod<[TransformArgs], HttpResponse>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const Arg = IDL.Rec();
	const Vec = IDL.Rec();
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
		is_running: IDL.Bool
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text,
		InterCanister: IDL.Text
	});
	const Result = IDL.Variant({ Ok: Circuit, Err: ApiError });
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
		sample_data: IDL.Opt(IDL.Text),
		cycles: IDL.Nat,
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
	const Output = IDL.Record({
		method: IDL.Text,
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		canister: IDL.Principal
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
	const NodeType = IDL.Variant({
		LookupCanister: LookupCanister,
		HttpRequest: HttpRequest,
		Output: Output,
		Canister: Canister,
		LookupHttpRequest: HttpRequest
	});
	const LookupTransformPin = IDL.Record({
		output: IDL.Text,
		input: IDL.Text
	});
	const ConditionGroup = IDL.Variant({ Or: IDL.Null, And: IDL.Null });
	const OperandType = IDL.Variant({ Field: IDL.Null, Value: IDL.Null });
	const DataType = IDL.Variant({
		BigInt: IDL.Null,
		String: IDL.Null,
		Boolean: IDL.Null,
		Principal: IDL.Null,
		Number: IDL.Null
	});
	const Operand = IDL.Record({
		operand_type: OperandType,
		data_type: DataType
	});
	const Operator = IDL.Variant({
		Equal: IDL.Null,
		Contains: IDL.Null,
		LessThanOrEqual: IDL.Null,
		GreaterThan: IDL.Null,
		LessThan: IDL.Null,
		GreaterThanOrEqual: IDL.Null,
		NotEqual: IDL.Null
	});
	const Rule = IDL.Record({
		field: IDL.Text,
		value: IDL.Text,
		operand: Operand,
		operator: Operator
	});
	const Condition = IDL.Variant({ Is: IDL.Null, Not: IDL.Null });
	const FilterPin = IDL.Record({
		condition_group: IDL.Opt(ConditionGroup),
		sample_data: IDL.Opt(IDL.Text),
		rules: IDL.Vec(Rule),
		condition: Condition
	});
	const MapperPin = IDL.Record({
		sample_data: IDL.Opt(IDL.Text),
		fields: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
	});
	const CustomPinLogic = IDL.Record({
		function: IDL.Opt(IDL.Text),
		script: IDL.Opt(IDL.Text)
	});
	const PinType = IDL.Variant({
		LookupTransformPin: LookupTransformPin,
		FilterPin: FilterPin,
		MapperPin: MapperPin,
		PrePin: CustomPinLogic,
		PostPin: CustomPinLogic,
		LookupFilterPin: FilterPin
	});
	const Pin = IDL.Record({ pin_type: PinType, order: IDL.Nat32 });
	const Node = IDL.Record({
		id: IDL.Nat32,
		updated_at: IDL.Nat64,
		node_type: NodeType,
		order: IDL.Nat32,
		pins: IDL.Vec(Pin),
		is_enabled: IDL.Bool,
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		is_error: IDL.Bool,
		is_running: IDL.Bool,
		circuit_id: IDL.Nat32
	});
	const Result_1 = IDL.Variant({ Ok: Node, Err: ApiError });
	const User = IDL.Record({
		circuits: IDL.Vec(IDL.Nat32),
		username: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal
	});
	const Result_2 = IDL.Variant({ Ok: User, Err: ApiError });
	const Result_3 = IDL.Variant({
		Ok: IDL.Tuple(IDL.Principal, IDL.Vec(Node)),
		Err: ApiError
	});
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
	const Result_4 = IDL.Variant({ Ok: IDL.Vec(Trace), Err: ApiError });
	const Result_5 = IDL.Variant({ Ok: IDL.Vec(Circuit), Err: ApiError });
	const Result_6 = IDL.Variant({ Ok: IDL.Vec(User), Err: ApiError });
	const Result_7 = IDL.Variant({ Ok: IDL.Text, Err: ApiError });
	const HttpHeader = IDL.Record({ value: IDL.Text, name: IDL.Text });
	const HttpResponse = IDL.Record({
		status: IDL.Nat,
		body: IDL.Vec(IDL.Nat8),
		headers: IDL.Vec(HttpHeader)
	});
	const TransformArgs = IDL.Record({
		context: IDL.Vec(IDL.Nat8),
		response: HttpResponse
	});
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
		add_circuit: IDL.Func([PostCircuit], [Result], []),
		add_node: IDL.Func([IDL.Nat32, NodeType], [Result_1], []),
		add_pin: IDL.Func([IDL.Nat32, Pin], [Result_1], []),
		create_user: IDL.Func([IDL.Opt(IDL.Text)], [Result_2], []),
		delete_node: IDL.Func([IDL.Nat32], [Result_1], []),
		delete_pin: IDL.Func([IDL.Nat32, Pin], [Result_1], []),
		disable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		disable_node: IDL.Func([IDL.Nat32], [Result_1], []),
		edit_circuit: IDL.Func([IDL.Nat32, PostCircuit], [Result], []),
		edit_node: IDL.Func([IDL.Nat32, NodeType], [Result_1], []),
		edit_order: IDL.Func([IDL.Nat32, IDL.Nat32], [Result_1], []),
		edit_pin: IDL.Func([IDL.Nat32, Pin], [Result_1], []),
		enable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		enable_node: IDL.Func([IDL.Nat32], [Result_1], []),
		get_circuit: IDL.Func([IDL.Nat32], [Result], ['query']),
		get_circuit_node: IDL.Func([IDL.Nat32], [Result_1], ['query']),
		get_circuit_nodes: IDL.Func([IDL.Nat32], [Result_3], ['query']),
		get_circuit_traces: IDL.Func([IDL.Nat32], [Result_4], ['query']),
		get_user: IDL.Func([], [Result_2], ['query']),
		get_user_circuits: IDL.Func([], [Result_5], ['query']),
		get_users: IDL.Func([], [Result_6], ['query']),
		preview_lookup_request: IDL.Func([LookupCanister], [Result_7], []),
		transform: IDL.Func([TransformArgs], [HttpResponse], ['query'])
	});
};
