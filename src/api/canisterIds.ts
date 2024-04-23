import { ENV } from 'lib/constants';

type CanisterId = {
	[key in typeof ENV]: string;
};

export const canisterId: CanisterId = {
	development: 'myqvg-hiaaa-aaaal-ac5da-cai',
	production: 'myqvg-hiaaa-aaaal-ac5da-cai'
};

export const MANAGEMENT_CANISTER_ID = 'aaaaa-aa';
