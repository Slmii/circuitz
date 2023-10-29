import type {
	Arg,
	DataType,
	Node as OldNode,
	VerificationType as OldVerificationType,
	OperandType,
	Operator,
	Rule,
	Token
} from 'declarations/nodes.declarations';
import type { LookCanisterArgType, Node, NodeSourceType, VerificationType } from 'lib/types';
import { dateFromNano } from './date.utils';
import { FilterRule, InputNodeFormValues, LookupCanisterArg, LookupCanisterFormValues } from 'components/NodeDrawers';
import { toPrincipal } from './identity.utils';
import { Option } from 'components/Form/Select';
import { Icons } from 'components/icons';

export const mapToNode = (node: OldNode): Node => {
	return {
		id: node.id,
		circuitId: node.circuit_id,
		userId: node.user_id,
		pins: node.pins,
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

	if ('Ouput' in node.nodeType) {
		return 'Output';
	}

	return '';
};

export const getLookupCanisterFormValues = (node?: Node): LookupCanisterFormValues => {
	if (!node || !('LookupCanister' in node.nodeType)) {
		return {
			args: [],
			canisterId: '',
			description: '',
			methodName: '',
			name: '',
			cycles: ''
		};
	}

	const lookup = node.nodeType.LookupCanister;

	return {
		args: lookup.args.map(arg => {
			const dataType = getLookupCanisterFormArgType(arg);
			let value = '';

			if ('String' in arg) {
				value = arg.String;
			}

			if ('Number' in arg) {
				value = arg.Number.toString();
			}

			if ('Boolean' in arg) {
				value = arg.Boolean.toString();
			}

			if ('BigInt' in arg) {
				value = Number(arg.BigInt).toString();
			}

			if ('Principal' in arg) {
				value = arg.Principal.toString();
			}

			return {
				dataType,
				value
			};
		}),
		canisterId: lookup.canister.toString(),
		description: lookup.description[0] ?? '',
		methodName: lookup.method,
		name: lookup.name,
		cycles: Number(lookup.cycles).toString()
	};
};

export const getLookupCanisterValuesAsArg = (args: LookupCanisterArg[]): Arg[] => {
	return args.map((arg): Arg => {
		if (arg.dataType === 'String') {
			return {
				String: arg.value
			};
		}

		if (arg.dataType === 'Number') {
			return {
				Number: Number(arg.value)
			};
		}

		if (arg.dataType === 'BigInt') {
			return {
				BigInt: BigInt(arg.value)
			};
		}

		if (arg.dataType === 'Principal') {
			return {
				Principal: toPrincipal(arg.value)
			};
		}

		return {
			Boolean: arg.value === 'true'
		};
	});
};

export const getLookupCanisterValuesAsArray = (args: LookupCanisterArg[]) => {
	return args.map(arg => {
		if (arg.dataType === 'String') {
			return arg.value;
		}

		if (arg.dataType === 'Number') {
			return Number(arg.value);
		}

		if (arg.dataType === 'BigInt') {
			return BigInt(arg.value);
		}

		if (arg.dataType === 'Principal') {
			return toPrincipal(arg.value);
		}

		return arg.value === 'true';
	});
};

export const getLookupCanisterFormArgType = (arg: Arg): LookCanisterArgType => {
	if ('String' in arg) {
		return 'String';
	}

	if ('Number' in arg) {
		return 'Number';
	}

	if ('BigInt' in arg) {
		return 'BigInt';
	}

	if ('Principal' in arg) {
		return 'Principal';
	}

	return 'Boolean';
};

export const getNodeMetaData = (node: Node): { name: string; description: string; type: NodeSourceType } => {
	if ('LookupCanister' in node.nodeType) {
		return {
			name: node.nodeType.LookupCanister.name,
			description: node.nodeType.LookupCanister.description[0] ?? '',
			type: 'LookupCanister'
		};
	}

	if ('LookupHttpRequest' in node.nodeType) {
		return {
			name: node.nodeType.LookupHttpRequest.name,
			description: node.nodeType.LookupHttpRequest.description[0] ?? '',
			type: 'LookupHttpRequest'
		};
	}

	if ('Output' in node.nodeType) {
		return {
			name: node.nodeType.Output.name,
			description: node.nodeType.Output.description[0] ?? '',
			type: 'Output'
		};
	}

	if ('HttpRequest' in node.nodeType) {
		return {
			name: node.nodeType.HttpRequest.name,
			description: node.nodeType.HttpRequest.description[0] ?? '',
			type: 'HttpRequest'
		};
	}

	return {
		name: node.nodeType.Canister.name,
		description: node.nodeType.Canister.description[0] ?? '',
		type: 'Canister'
	};
};

/**
 * Get all the nested fields from the sample data object, seperated by a dot.
 */
export function getSampleDataFields<T extends object>(obj: T, path: string[] = []): Option[] {
	return Object.entries(obj).reduce<Option[]>((acc, [key, value]) => {
		const newPath = [...path, key];

		if (Array.isArray(value)) {
			return acc;
		}

		// Check if object, so not array, and not null, and not undefined
		if (typeof value === 'object') {
			return [...acc, ...getSampleDataFields(value, newPath)];
		} else {
			const path = newPath.join('.');
			return [...acc, { id: path, label: path }];
		}
	}, []);
}

export const getFilterPinValuesAsArg = (pins: FilterRule[]): Rule[] => {
	return pins.map((pin): Rule => {
		let dataType: DataType = { String: null };
		if (pin.dataType === 'BigInt') {
			dataType = { BigInt: null };
		} else if (pin.dataType === 'Boolean') {
			dataType = { Boolean: null };
		} else if (pin.dataType === 'Number') {
			dataType = { Number: null };
		} else if (pin.dataType === 'Principal') {
			dataType = { Principal: null };
		}

		let operandType: OperandType = { Field: null };
		if (pin.operandType === 'Value') {
			operandType = { Value: null };
		}

		let operator: Operator = { Equal: null };
		if (pin.operator === 'NotEqual') {
			operator = { NotEqual: null };
		} else if (pin.operator === 'GreaterThan') {
			operator = { GreaterThan: null };
		} else if (pin.operator === 'GreaterThanOrEqual') {
			operator = { GreaterThanOrEqual: null };
		} else if (pin.operator === 'LessThan') {
			operator = { LessThan: null };
		} else if (pin.operator === 'LessThanOrEqual') {
			operator = { LessThanOrEqual: null };
		}

		return {
			field: pin.field,
			value: pin.value,
			operand: {
				data_type: dataType,
				operand_type: operandType
			},
			operator: operator
		};
	});
};

export const getNodeIcon = (node: Node): Icons => {
	if ('LookupCanister' in node.nodeType || 'Canister' in node.nodeType) {
		return 'infinite';
	}

	if ('LookupHttpRequest' in node.nodeType || 'HttpRequest' in node.nodeType) {
		return 'request';
	}

	return 'output-linear';
};
