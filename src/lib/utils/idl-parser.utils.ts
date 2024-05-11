import { IDLType, ExctractedIDLType, ParsedIDL } from 'lib/types';

const basicTypesMap: Record<IDLType, string> = {
	'IDL.Nat32': 'Number',
	'IDL.Nat64': 'Number',
	'IDL.Text': 'String',
	'IDL.Bool': 'Boolean',
	'IDL.Nat': 'Number',
	'IDL.Principal': 'String',
	'IDL.Null': 'Null'
};

// Function to extract the IDL.Service block
export function extractIDLServiceBlock(tsString: string): string {
	const serviceBlockRegex = /IDL\.Service\(\{([\s\S]*?)\}\);/;
	const match = tsString.match(serviceBlockRegex);
	return match ? match[1].trim() : '';
}

/**
 * Function to split a string by top-level commas only
 */
function splitTopLevelCommas(str: string): string[] {
	const parts: string[] = [];
	let currentPart = [];
	let depth = 0;

	for (let i = 0; i < str.length; i++) {
		const char = str[i];

		// Check if we are inside a nested object
		if (char === '(' || char === '{' || char === '[') {
			// Increase depth
			depth++;
		}
		// Check if we are exiting a nested object
		else if (char === ')' || char === '}' || char === ']') {
			// Decrease depth
			depth--;
		}

		// Check if we are at the top level and the character is a comma
		if (char === ',' && depth === 0) {
			// Push the current part to the parts array
			parts.push(currentPart.join('').trim());
			currentPart = [];
		} else {
			// Add the character to the current part
			currentPart.push(char);
		}
	}

	if (currentPart.length > 0) {
		// Push the last part
		parts.push(currentPart.join('').trim());
	}

	return parts;
}

/**
 * Extract and parse all IDL type definitions (Records and Variants)
 */
export function extractTypeDefinitions(tsString: string) {
	const recordRegex = /const (\w+) = IDL\.Record\(\{([\s\S]*?)\}\);/g;
	const variantRegex = /const (\w+) = IDL\.Variant\(\{([\s\S]*?)\}\);/g;

	const types: ExctractedIDLType = {};
	let match: RegExpExecArray | null = null;

	const reduceToObject = (acc: Record<string, IDLType>, field: string) => {
		// Split the field (eg: "'name': IDL.Text") into key and value
		const [key, value] = field.split(':').map(string => string.trim());

		// Remove extra quotes from key within the IDL
		acc[key.replace(/['"]/g, '')] = value as IDLType;

		return acc;
	};

	// Extract records
	while ((match = recordRegex.exec(tsString)) !== null) {
		const typeName = match[1];
		const args = splitTopLevelCommas(match[2]).filter(Boolean).reduce<Record<string, IDLType>>(reduceToObject, {});

		types[typeName] = { type: 'Record', args };
	}

	// Reset regex index for variant extraction
	recordRegex.lastIndex = 0;

	// Extract variants
	while ((match = variantRegex.exec(tsString)) !== null) {
		const typeName = match[1];
		const variants = splitTopLevelCommas(match[2]).filter(Boolean).reduce<Record<string, IDLType>>(reduceToObject, {});

		types[typeName] = { type: 'Variant', variants };
	}

	return types;
}

/**
 * Recursive function to resolve type names to their definitions
 */
export function resolveType(typeName: IDLType, typeDefs: ExctractedIDLType) {
	if (basicTypesMap[typeName]) {
		return basicTypesMap[typeName];
	}

	if (typeDefs[typeName]) {
		const typeInfo = typeDefs[typeName];
		if (typeInfo.type === 'Record' && typeInfo.args) {
			const args: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(typeInfo.args)) {
				args[key] = resolveType(value, typeDefs);
			}

			return { args };
		}

		if (typeInfo.type === 'Variant' && typeInfo.variants) {
			const variants: Record<string, unknown> = {};
			for (const [key, value] of Object.entries(typeInfo.variants)) {
				variants[key] = resolveType(value, typeDefs);
			}

			return { variants };
		}
	}

	return typeName; // Fallback if no mapping found
}

/**
 * Function to parse the service functions from the IDL.Service block
 */
export function parseServiceFunctions(serviceBlock: string, typeDefs: ExctractedIDLType) {
	const functionRegex = /'([^']+)'\s*:\s*IDL\.Func\(\[([^\]]*)\], \[([^\]]*)\], \[([^\]]*)\]\),/g;
	const functions: ParsedIDL[] = [];

	let match: RegExpExecArray | null = null;

	while ((match = functionRegex.exec(serviceBlock)) !== null) {
		const [, name, inputs] = match;
		const parsedInputs = inputs.split(',').map(input => resolveType(input.trim() as IDLType, typeDefs));

		functions.push({ name, params: parsedInputs });
	}

	return functions;
}

export const parseIDL = (did: string) => {
	const idlServiceBlock = extractIDLServiceBlock(did);
	const typeDefinitions = extractTypeDefinitions(did);
	return parseServiceFunctions(idlServiceBlock, typeDefinitions);
};
