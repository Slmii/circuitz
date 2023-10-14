import { VerificationType, Node, NodeTypeKey } from 'lib/types';

export interface InputNodeDrawerProps {
	open: boolean;
	nodeType: NodeTypeKey;
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
	args: LookupCanisterArg[];
}

export interface LookupCanisterArg {
	name: string;
	value: string;
}
