import type { Node as OldNode, VerificationType as OldVerificationType, Token } from 'declarations/nodes.declarations';
import type { Node, VerificationType } from 'lib/types';
import { dateFromNano } from './date.utils';

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

export const getVerificationType = (verificationType: OldVerificationType): VerificationType => {
	if ('None' in verificationType) {
		return 'none';
	}

	if ('Token' in verificationType) {
		return 'token';
	}

	return 'whitelist';
};

export const getVerificationToken = (verificationType: OldVerificationType): Token | undefined => {
	if ('None' in verificationType) {
		return;
	}

	if ('Whitelist' in verificationType) {
		return undefined;
	}

	return {
		field: verificationType.Token.field,
		token: verificationType.Token.token
	};
};

export const getVerificationWhitelist = (verificationType: OldVerificationType): { principal: string }[] => {
	if ('None' in verificationType) {
		return [];
	}

	if ('Token' in verificationType) {
		return [];
	}

	return verificationType.Whitelist.map(principal => ({ principal: principal.toString() }));
};
