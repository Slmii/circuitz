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
	PinType
} from 'declarations/nodes.declarations';

export interface Node {
	id: number;
	circuitId: number;
	userId: Principal;
	pin: Array<Pin>;
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

type KeysOfUnion<T> = T extends T ? keyof T : never;
type NodeTypeKey = KeysOfUnion<NodeType>;
type PinTypeKey = KeysOfUnion<PinType>;
type ArgTypeKey = KeysOfUnion<Arg>;
type OperatorTypeKey = KeysOfUnion<Operator>;
type ConditionGroupTypeKey = KeysOfUnion<ConditionGroup>;
type ConditionTypeKey = KeysOfUnion<Condition>;
type OperandTypeKey = KeysOfUnion<OldOperandType>;
type DataTypeKey = KeysOfUnion<OldDataType>;

export type NodeSourceType = NodeTypeKey;
export type PinSourceType = PinTypeKey;
export type LookCanisterArgType = ArgTypeKey;
export type OperatorType = OperatorTypeKey;
export type ConditionGroupType = ConditionGroupTypeKey;
export type ConditionType = ConditionTypeKey;
export type OperandType = OperandTypeKey;
export type DataType = DataTypeKey;

export interface SampleDataOptions {
	isFilterPreview?: boolean;
}
