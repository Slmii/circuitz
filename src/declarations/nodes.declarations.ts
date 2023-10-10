/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError = { NotFound: string } | { Unauthorized: string } | { AlreadyExists: string };
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
export interface Input {
	name: string;
	description: [] | [string];
	verification_type: VerificationType;
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
	is_finished: boolean;
	order: number;
	created_at: bigint;
	user_id: Principal;
	is_error: boolean;
	is_active: boolean;
	circuit_id: number;
}
export type NodeType =
	| { Pin: Pin }
	| { Transformer: Transformer }
	| { Input: Input }
	| { Ouput: Ouput }
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
	| { PostResponsePin: CustomPinLogic }
	| { MapperPin: Mapper }
	| { Filter: Array<ConditionGroup> }
	| { PrePin: CustomPinLogic };
export type Result = { Ok: [Principal, Array<Node>] } | { Err: ApiError };
export interface Transformer {
	output: string;
	input: string;
}
export type VerificationType = { SampleData: string } | { Token: string } | { Whitelist: Array<Principal> };
export interface _SERVICE {
	get_circuit_nodes: ActorMethod<[number], Result>;
}

export const idlFactory = ({ IDL }: any) => {
	const CustomPinLogic = IDL.Record({
		function: IDL.Opt(IDL.Text),
		script: IDL.Opt(IDL.Text)
	});
	const Mapper = IDL.Record({
		output: IDL.Text,
		interface: IDL.Text,
		input: IDL.Text
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
		PostResponsePin: CustomPinLogic,
		MapperPin: Mapper,
		Filter: IDL.Vec(ConditionGroup),
		PrePin: CustomPinLogic
	});
	const Pin = IDL.Record({ pin_type: PinType, order: IDL.Nat32 });
	const Transformer = IDL.Record({ output: IDL.Text, input: IDL.Text });
	const VerificationType = IDL.Variant({
		SampleData: IDL.Text,
		Token: IDL.Text,
		Whitelist: IDL.Vec(IDL.Principal)
	});
	const Input = IDL.Record({
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		verification_type: VerificationType
	});
	const Ouput = IDL.Record({
		method: IDL.Text,
		name: IDL.Text,
		description: IDL.Opt(IDL.Text),
		canister: IDL.Principal
	});
	const NodeType = IDL.Variant({
		Pin: Pin,
		Transformer: Transformer,
		Input: Input,
		Ouput: Ouput,
		Mapper: Mapper
	});
	const Node = IDL.Record({
		id: IDL.Nat32,
		pin: IDL.Vec(Pin),
		updated_at: IDL.Nat64,
		node_type: NodeType,
		is_finished: IDL.Bool,
		order: IDL.Nat32,
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		is_error: IDL.Bool,
		is_active: IDL.Bool,
		circuit_id: IDL.Nat32
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text
	});
	const Result = IDL.Variant({
		Ok: IDL.Tuple(IDL.Principal, IDL.Vec(Node)),
		Err: ApiError
	});
	return IDL.Service({
		get_circuit_nodes: IDL.Func([IDL.Nat32], [Result], ['query'])
	});
};