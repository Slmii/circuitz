import { Input } from 'declarations/nodes.declarations';
import { VerificationType } from 'lib/types';

export interface NodeDrawerProps {
	title: string;
	isOpen: boolean;
	isLoading: boolean;
	onClose: () => void;
	onSubmit: () => void;
}

export interface InputNodeDrawerProps {
	inputNode?: Input;
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
