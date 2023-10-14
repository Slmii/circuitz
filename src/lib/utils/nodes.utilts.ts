import type { Node as OldNode, VerificationType as OldVerificationType, Token } from 'declarations/nodes.declarations';
import type { Node, VerificationType } from 'lib/types';
import { dateFromNano } from './date.utils';
import { InputNodeFormValues } from 'components/NodeDrawer';

export const mapToNode = (node: OldNode): Node => {
	return {
		id: node.id,
		circuitId: node.circuit_id,
		userId: node.user_id,
		pin: node.pin,
		nodeType: node.node_type,
		order: node.order,
		isRunning: node.is_running,
		isError: node.is_error,
		isEnabled: node.is_enabled,
		createdAt: dateFromNano(node.created_at),
		updatedAt: dateFromNano(node.updated_at)
	};
};

export const getInputNodeFormValues = (node?: Node): InputNodeFormValues => {
	if (!node || !('Input' in node.nodeType)) {
		return {
			description: '',
			name: '',
			sampleData: '',
			verificationType: 'none',
			verificationTypeToken: '',
			verificationTypeTokenField: '',
			verificationTypeWhitelist: []
		};
	}

	const token = getVerificationToken(node.nodeType.Input.verification_type);

	return {
		description: node.nodeType.Input.description[0] ?? '',
		name: node.nodeType.Input.name,
		sampleData: node.nodeType.Input.sample_data[0] ?? '',
		verificationType: getVerificationType(node.nodeType.Input.verification_type),
		verificationTypeToken: token?.token ?? '',
		verificationTypeTokenField: token?.field ?? '',
		verificationTypeWhitelist: getVerificationWhitelist(node.nodeType.Input.verification_type)
	};
};

const getVerificationType = (verificationType: OldVerificationType): VerificationType => {
	if ('None' in verificationType) {
		return 'none';
	}

	if ('Token' in verificationType) {
		return 'token';
	}

	return 'whitelist';
};

const getVerificationToken = (verificationType: OldVerificationType): Token | undefined => {
	if ('None' in verificationType) {
		return;
	}

	if ('Whitelist' in verificationType) {
		return;
	}

	return {
		field: verificationType.Token.field,
		token: verificationType.Token.token
	};
};

const getVerificationWhitelist = (verificationType: OldVerificationType): { principal: string }[] => {
	if ('None' in verificationType) {
		return [];
	}

	if ('Token' in verificationType) {
		return [];
	}

	return verificationType.Whitelist.map(principal => ({ principal: principal.toString() }));
};
