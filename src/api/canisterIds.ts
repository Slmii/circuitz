import { ENV } from 'lib/constants/env.constants';

type CanisterId = {
	[key in typeof ENV]: string;
};

export const circuitsCanisterId: CanisterId = {
	development: '7l53v-aqaaa-aaaap-abggq-cai',
	production: '5rvte-7aaaa-aaaap-aa4ja-cai'
};

export const nodesCanisterId: CanisterId = {
	development: 'njs4r-miaaa-aaaak-qau2a-cai',
	production: 'k3hxs-oqaaa-aaaak-qb25a-cai'
};

export const usersCanisterId: CanisterId = {
	development: 'njs4r-miaaa-aaaak-qau2a-cai',
	production: 'k3hxs-oqaaa-aaaak-qb25a-cai'
};

export const initialCanisterWhitelist = (env: typeof ENV) => [circuitsCanisterId[env], nodesCanisterId[env]];
