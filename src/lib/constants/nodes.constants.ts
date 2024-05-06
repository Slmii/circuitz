import { HeaderRequestMethodType, LookCanisterArgType } from 'lib/types';

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
