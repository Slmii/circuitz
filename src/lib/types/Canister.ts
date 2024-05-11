export type CanisterStatus = 'stopped' | 'stopping' | 'running';

export type IDLType = 'IDL.Nat32' | 'IDL.Nat' | 'IDL.Nat64' | 'IDL.Text' | 'IDL.Bool' | 'IDL.Principal' | 'IDL.Null';

export interface ExtractedIDLFunction {
	name: string;
	params: Array<unknown>;
}

export type ExctractedIDLType = Record<
	string,
	{
		type: 'Record' | 'Variant';
		args?: Record<string, IDLType>;
		variants?: Record<string, IDLType>;
	}
>;
