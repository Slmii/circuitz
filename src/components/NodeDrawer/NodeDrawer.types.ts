import { VerificationType, Node } from 'lib/types';

export interface NodeDrawerProps {
	title: string;
	isOpen: boolean;
	isDisabled: boolean;
	isLoading: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

export interface InputNodeProps {
	node?: Node;
	open: boolean;
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
