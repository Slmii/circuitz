import type { Node as OldNode, VerificationType as OldVerificationType, Token } from 'declarations/nodes.declarations';
import type { Node, VerificationType } from 'lib/types';
import { dateFromNano } from './date.utils';
import { InputNodeFormValues, LookupCanisterFormValues } from 'components/NodeDrawers';

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

export const getInputCanisterFormValues = (node?: Node): InputNodeFormValues => {
	if (!node || !('Canister' in node.nodeType)) {
		return {
			description: '',
			name: '',
			sampleData: '',
			verificationType: 'none',
			verificationTypeToken: '',
			verificationTypeTokenField: '',
			verificationTypeWhitelist: [{ principal: '' }]
		};
	}

	const token = getVerificationToken(node.nodeType.Canister.verification_type);

	return {
		description: node.nodeType.Canister.description[0] ?? '',
		name: node.nodeType.Canister.name,
		sampleData: node.nodeType.Canister.sample_data[0] ?? '',
		verificationType: getVerificationType(node.nodeType.Canister.verification_type),
		verificationTypeToken: token?.token ?? '',
		verificationTypeTokenField: token?.field ?? '',
		verificationTypeWhitelist: getVerificationWhitelist(node.nodeType.Canister.verification_type)
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
		return [{ principal: '' }];
	}

	if ('Token' in verificationType) {
		return [{ principal: '' }];
	}

	return verificationType.Whitelist.map(principal => ({ principal: principal.toString() }));
};

export const getNodeTitle = (node: Node): string => {
	if ('LookupCanister' in node.nodeType) {
		return 'Lookup Canister';
	}

	if ('LookupHttpRequest' in node.nodeType) {
		return 'Lookup HTTP Request';
	}

	if ('Transformer' in node.nodeType) {
		return 'Transformer';
	}

	if ('Ouput' in node.nodeType) {
		return 'Output';
	}

	if ('Mapper' in node.nodeType) {
		return 'Mapper';
	}

	return '';
};

export const getLookupCanisterFormValues = (node?: Node): LookupCanisterFormValues => {
	if (!node || !('LookupCanister' in node.nodeType)) {
		return {
			args: [{ name: '', value: '' }],
			canisterId: '',
			description: '',
			methodName: '',
			name: ''
		};
	}

	const lookup = node.nodeType.LookupCanister;

	return {
		args: lookup.args.map(arg => ({ name: arg[0], value: arg[1] })),
		canisterId: lookup.canister.toString(),
		description: lookup.description[0] ?? '',
		methodName: lookup.method,
		name: lookup.name
	};
};
