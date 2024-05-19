import { Option } from 'components/Form/Select';
import { ConnectorType } from 'lib/types';
import { HeaderRequestMethodType, LookCanisterArgType } from 'lib/types';

export const APPLICATION_OPTIONS: Option<ConnectorType>[] = [
	{
		id: 'Http',
		label: 'HTTP'
	},
	{
		id: 'Canister',
		label: 'Canister'
	}
];

export const HTTP_METHODS: HeaderRequestMethodType[] = ['GET', 'POST'];
export const DATA_TYPES: LookCanisterArgType[] = [
	'String',
	'Number',
	'BigInt',
	'Boolean',
	'Principal',
	'Array',
	'Object'
];
