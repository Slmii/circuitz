import { VerificationType, Node, NodeSourceType, LookCanisterArgType } from 'lib/types';

export interface InputNodeDrawerProps {
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
	sampleData: string;
}

export interface LookupCanisterFormValues {
	name: string;
	description: string;
	canisterId: string;
	methodName: string;
	cycles: string;
	args: LookupCanisterArg[];
}

export interface LookupCanisterArg {
	dataType: LookCanisterArgType;
	value: string;
}
