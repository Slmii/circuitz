import type {
	Arg,
	DataType as OldDataType,
	FilterPin,
	Node as OldNode,
	VerificationType as OldVerificationType,
	OperandType as OldOperandType,
	Operator as OldOperator,
	Rule,
	Token
} from 'declarations/nodes.declarations';
import type {
	LookCanisterArgType,
	Node,
	NodeSourceType,
	VerificationType,
	DataType,
	OperandType,
	OperatorType,
	PinSourceType,
	SampleData
} from 'lib/types';
import { dateFromNano } from './date.utils';
import {
	FilterPinFormValues,
	FilterRule,
	InputNodeFormValues,
	LookupCanisterArg,
	LookupCanisterFormValues
} from 'components/NodeDrawers';
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

/**
 * Get the form values for the input node. If no node is provided, return the default values.
 */
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

/**
 * Get the form values for the lookup canister node. If no node is provided, return the default values.
 */
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

/**
 * Map the LookupCanister form values arguments to the Arg type. This will be passed to the backend.
 */
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

/**
 * Map the LookupCanister form values arguments as an array of single values.
 */
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

/**
 * Get the argument type for the LookupCanister form values.
 */
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

/**
 * Map the FilterPin form values arguments to the Rule type. This will be passed to the backend.
 */
export const getFilterPinValuesAsArg = (pins: FilterRule[]): Rule[] => {
	return pins.map((pin): Rule => {
		let dataType: OldDataType = { String: null };
		if (pin.dataType === 'BigInt') {
			dataType = { BigInt: null };
		} else if (pin.dataType === 'Boolean') {
			dataType = { Boolean: null };
		} else if (pin.dataType === 'Number') {
			dataType = { Number: null };
		} else if (pin.dataType === 'Principal') {
			dataType = { Principal: null };
		}

		let operandType: OldOperandType = { Field: null };
		if (pin.operandType === 'Value') {
			operandType = { Value: null };
		}

		let operator: OldOperator = { Equal: null };
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

/**
 * Get the icon for the node.
 */
export const getNodeIcon = (node: Node): Icons => {
	if ('LookupCanister' in node.nodeType || 'Canister' in node.nodeType) {
		return 'infinite';
	}

	if ('LookupHttpRequest' in node.nodeType || 'HttpRequest' in node.nodeType) {
		return 'request';
	}

	return 'output-linear';
};

/**
 * Get the form values for the filter pin.
 */
export const getFilterPinFormValues = (filterPin?: FilterPin): FilterPinFormValues => {
	if (!filterPin) {
		return {
			condition: 'Is',
			conditionGroup: null,
			inputSampleData: '',
			rules: [
				{
					field: '',
					operator: '',
					value: '',
					dataType: 'String',
					operandType: 'Value'
				}
			]
		};
	}

	return {
		condition: 'Is' in filterPin.condition ? 'Is' : 'Not',
		conditionGroup: getConditionGroup(filterPin),
		inputSampleData: filterPin.sample_data[0] ?? '',
		rules: filterPin.rules.map(rule => ({
			dataType: getRuleDataType(rule),
			operandType: getRuleOparandType(rule),
			field: rule.field,
			value: rule.value,
			operator: getRuleOperator(rule)
		}))
	};
};

const getConditionGroup = (filterPin: FilterPin) => {
	if (!filterPin.condition_group[0]) {
		return null;
	}

	if ('Or' in filterPin.condition_group[0]) {
		return 'Or';
	}

	return 'And';
};

const getRuleDataType = (rule: Rule): DataType => {
	if ('BigInt' in rule.operand.data_type) {
		return 'BigInt';
	}

	if ('Boolean' in rule.operand.data_type) {
		return 'Boolean';
	}

	if ('Number' in rule.operand.data_type) {
		return 'Number';
	}

	if ('Principal' in rule.operand.data_type) {
		return 'Principal';
	}

	return 'String';
};

const getRuleOparandType = (rule: Rule): OperandType => {
	if ('Field' in rule.operand.operand_type) {
		return 'Field';
	}

	return 'Value';
};

const getRuleOperator = (rule: Rule): OperatorType => {
	if ('NotEqual' in rule.operator) {
		return 'NotEqual';
	}

	if ('GreaterThan' in rule.operator) {
		return 'GreaterThan';
	}

	if ('GreaterThanOrEqual' in rule.operator) {
		return 'GreaterThanOrEqual';
	}

	if ('LessThan' in rule.operator) {
		return 'LessThan';
	}

	if ('LessThanOrEqual' in rule.operator) {
		return 'LessThanOrEqual';
	}

	return 'Equal';
};

export function getPin<T>(node: Node, pinType: PinSourceType): T | undefined {
	const pin = node.pins.find(pin => pinType in pin.pin_type);

	if (!pin || !(pinType in pin.pin_type)) {
		return;
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return pin.pin_type[pinType] as T;
}

/**
 * Check if the filter is true for the given data.
 *
 * @param rulesConfig The filter pin form values
 * @param data The data to validate against the filter. If not provided, the input sample data will be used.
 */
export const isFilterTrue = (rulesConfig: FilterPinFormValues, data?: SampleData): boolean => {
	if (rulesConfig.rules.length === 0) {
		return false;
	}

	const dataToValidate = data ? data : JSON.parse(rulesConfig.inputSampleData);

	if (rulesConfig.rules.length === 1 || rulesConfig.conditionGroup === null) {
		return evaluateRule(rulesConfig.rules[0], dataToValidate, rulesConfig.condition);
	}

	let result = rulesConfig.conditionGroup === 'And';
	for (const rule of rulesConfig.rules) {
		const isRuleSatisfied = evaluateRule(rule, dataToValidate, rulesConfig.condition);

		if (rulesConfig.conditionGroup === 'And') {
			result = result && isRuleSatisfied;
		} else {
			// "Or" condition
			result = result || isRuleSatisfied;
		}
	}

	return result;
};

const evaluateRule = (rule: FilterRule, data: Record<string, unknown>, condition: 'Is' | 'Not'): boolean => {
	const fieldValue = getNestedValue(data, rule.field) as number | bigint | boolean | string;
	let ruleValue: number | bigint | boolean | string;

	// Fetch the operand value based on operandType
	if (rule.operandType === 'Field') {
		// Treat rule.value as a field path
		ruleValue = getNestedValue(data, rule.value) as number | bigint | boolean | string;
	} else {
		// Treat rule.value as a literal value
		ruleValue = rule.value;
	}

	// Convert to appropriate type
	switch (rule.dataType) {
		case 'Number':
			ruleValue = Number(ruleValue);
			break;
		case 'BigInt':
			ruleValue = BigInt(ruleValue);
			break;
		case 'Boolean':
			ruleValue = ruleValue.toString().toLowerCase() === 'true';
			break;
		case 'String':
		case 'Principal':
			ruleValue = ruleValue.toString();
			break;
	}

	let isRuleSatisfied: boolean;
	switch (rule.operator) {
		case 'Equal':
			// console.log('Equal', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue === ruleValue;
			break;
		case 'NotEqual':
			// console.log('NotEqual', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue !== ruleValue;
			break;
		case 'LessThan':
			// console.log('LessThan', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue < ruleValue;
			break;
		case 'GreaterThan':
			// console.log('GreaterThan', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue > ruleValue;
			break;
		case 'LessThanOrEqual':
			// console.log('LessThanOrEqual', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue <= ruleValue;
			break;
		case 'GreaterThanOrEqual':
			// console.log('GreaterThanOrEqual', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue >= ruleValue;
			break;
		case 'Contains':
			// console.log('Contains', { fieldValue, ruleValue });
			isRuleSatisfied = fieldValue.toString().includes(ruleValue.toString());
			break;
		default:
			isRuleSatisfied = false;
	}

	if (condition === 'Not') {
		isRuleSatisfied = !isRuleSatisfied;
	}

	return isRuleSatisfied;
};

const getNestedValue = (data: SampleData, path: string): unknown => {
	return path.split('.').reduce((acc, part) => {
		if (acc && typeof acc === 'object' && part in acc) {
			return (acc as SampleData)[part];
		}
		return undefined;
	}, data as unknown);
};
