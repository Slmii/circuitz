import { DataType, OperandType, OperatorType } from 'lib/types';
import { Option } from 'components/Form/Select';

export const OPERATORS: Option<OperatorType>[] = [
	{
		id: 'Equal',
		label: 'Equal'
	},
	{
		id: 'LessThanOrEqual',
		label: 'Less Than Or Equal'
	},
	{
		id: 'GreaterThan',
		label: 'Greater Than'
	},
	{
		id: 'LessThan',
		label: 'Less Than'
	},
	{
		id: 'GreaterThanOrEqual',
		label: 'Greater Than Or Equal'
	},
	{
		id: 'NotEqual',
		label: 'Not Equal'
	},
	{
		id: 'Contains',
		label: 'Contains'
	}
];

export const OPERAND_TYPES: Option<OperandType>[] = [
	{
		id: 'Value',
		label: 'Value'
	},
	{
		id: 'Field',
		label: 'Field'
	}
];

export const DATA_TYPES: Option<DataType>[] = [
	{
		id: 'String',
		label: 'String'
	},
	{
		id: 'Number',
		label: 'Number'
	},
	{
		id: 'Boolean',
		label: 'Boolean'
	},
	{
		id: 'Principal',
		label: 'Principal'
	},
	{
		id: 'BigInt',
		label: 'BigInt'
	}
];
