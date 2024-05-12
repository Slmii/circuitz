export type CanisterStatus = 'stopped' | 'stopping' | 'running';

type IDLOpt<T extends string> = `IDL.Opt(${T})`;
type IDLVec<T extends string> = `IDL.Vec(${T})`;
type BasicIDLType =
	| 'IDL.Nat32'
	| 'IDL.Nat'
	| 'IDL.Nat64'
	| 'IDL.Text'
	| 'IDL.Bool'
	| 'IDL.Principal'
	| 'IDL.Null'
	| 'IDL.Float32';
export type IDLType = BasicIDLType | IDLOpt<BasicIDLType> | IDLVec<BasicIDLType>;

type BasicIDLTypeValue = 'Number' | 'String' | 'Boolean' | 'Null' | 'Principal';
export type IDLTypeValue = BasicIDLTypeValue | `Array(${BasicIDLTypeValue})`;

export interface ExtractedIDLFunction {
	name: string;
	params: Array<unknown>;
}

export interface IsRequiredIDLType {
	required: boolean;
	type: IDLType;
}

export type ExctractedIDLType = Record<
	string,
	{
		type: 'Record' | 'Variant';
		args?: Record<string, IsRequiredIDLType>;
		variants?: Record<string, IsRequiredIDLType>;
	}
>;
