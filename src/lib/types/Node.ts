import { Principal } from '@dfinity/principal';
import {
	Arg,
	Condition,
	ConditionGroup,
	DataType as OldDataType,
	NodeType,
	OperandType as OldOperandType,
	Operator,
	Pin,
	PinType,
	HttpRequestMethod
} from 'declarations/nodes.declarations';

export interface Node {
	id: number;
	circuitId: number;
	userId: Principal;
	pins: Array<Pin>;
	nodeType: NodeType;
	order: number;
	isRunning: boolean;
	isError: boolean;
	isEnabled: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type VerificationType = 'token' | 'whitelist' | 'none';

export interface NodeSource {
	id: NodeSourceType;
	label: string;
	icon: string;
	disabled: boolean;
}

export type KeysOfUnion<T> = T extends T ? keyof T : never;
export type NodeSourceType = KeysOfUnion<NodeType>;
export type PinSourceType = KeysOfUnion<PinType>;
export type LookCanisterArgType = KeysOfUnion<Arg>;
export type OperatorType = KeysOfUnion<Operator>;
export type ConditionGroupType = KeysOfUnion<ConditionGroup>;
export type ConditionType = KeysOfUnion<Condition>;
export type OperandType = KeysOfUnion<OldOperandType>;
export type DataType = KeysOfUnion<OldDataType>;
export type HeaderRequestMethodType = Uppercase<KeysOfUnion<HttpRequestMethod>>;

export type SampleData = Record<
	string,
	Partial<Record<'LookupCanister' | 'LookupHttpRequest' | 'PreMapperPin' | 'PostMapperPin', unknown>>
>;
