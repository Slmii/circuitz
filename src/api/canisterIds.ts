import { ENV } from 'lib/constants';

type CanisterId = {
	[key in typeof ENV]: string;
};

export const circuitsCanisterId: CanisterId = {
	development: 'myqvg-hiaaa-aaaal-ac5da-cai',
	production: 'myqvg-hiaaa-aaaal-ac5da-cai'
};

export const nodesCanisterId: CanisterId = {
	development: 'm7rts-kqaaa-aaaal-ac5dq-cai',
	production: 'm7rts-kqaaa-aaaal-ac5dq-cai'
};

export const usersCanisterId: CanisterId = {
	development: 'mos4g-maaaa-aaaal-qcevq-cai',
	production: 'mos4g-maaaa-aaaal-qcevq-cai'
};

export const tracesCanisterId: CanisterId = {
	development: 'otpso-7iaaa-aaaal-qce2a-cai',
	production: 'otpso-7iaaa-aaaal-qce2a-cai'
};

export const MANAGEMENT_CANISTER_ID = 'aaaaa-aa';

export const initialCanisterWhitelist = (env: typeof ENV) => [circuitsCanisterId[env], nodesCanisterId[env]];
