import {
	VerificationType,
	Node,
	NodeSourceType,
	LookCanisterArgType,
	OperatorType,
	ConditionType,
	ConditionGroupType,
	OperandType,
	DataType,
	HeaderRequestMethodType,
	ConnectorType
} from 'lib/types';

export interface InputNodeDrawerProps {
	open: boolean;
	nodeType?: NodeSourceType;
	node?: Node;
	onClose: () => void;
}

export interface OutputNodeDrawerProps {
	open: boolean;
	nodeType?: NodeSourceType;
	node?: Node;
	onClose: () => void;
}

export interface LookupNodeDrawerProps {
	open: boolean;
	nodeType: NodeSourceType;
	node?: Node;
	onClose: () => void;
}

export interface InputNodeFormValues {
	name: string;
	description: string;
	verificationType: VerificationType;
	verificationTypeToken: string;
	verificationTypeTokenField: string;
	verificationTypeWhitelist: { principal: string }[];
	inputSampleData: string;
}

export interface OutputNodeFormValues {
	name: string;
	description: string;
	applcation: ConnectorType;
	connector: string;
}

export interface LookupCanisterFormValues {
	name: string;
	description: string;
	canisterId: string;
	methodName: string;
	cycles: string;
	args: LookupCanisterArg[];
	inputSampleData: string;
}

export interface LookupHttpRequestFormValues {
	name: string;
	description: string;
	url: string;
	method: HeaderRequestMethodType;
	cycles: string;
	headers: Array<{ key: string; value: string }>;
	requestBody: string;
	inputSampleData: string;
}

export interface LookupCanisterArg {
	dataType: LookCanisterArgType;
	value: string;
}

export interface FilterPinFormValues {
	rules: FilterRule[];
	condition: ConditionType;
	conditionGroup: ConditionGroupType | null;
	inputSampleData: string;
}

export interface FilterRule {
	field: string;
	operator: OperatorType | '';
	value: string;
	operandType: OperandType;
	dataType: DataType;
}

export interface MapperPinFormValues {
	inputSampleData: string;
	fields: {
		input: string;
		output: string;
	}[];
}
