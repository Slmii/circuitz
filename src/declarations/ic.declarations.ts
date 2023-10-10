/* eslint-disable no-mixed-spaces-and-tabs */
import type { ActorMethod } from '@dfinity/agent';
import type { Principal } from '@dfinity/principal';

export type bitcoin_address = string;
export type bitcoin_network = { mainnet: null } | { testnet: null };
export type block_hash = Uint8Array;
export type canister_id = Principal;
export interface canister_settings {
	freezing_threshold: [] | [bigint];
	controllers: [] | [Array<Principal>];
	memory_allocation: [] | [bigint];
	compute_allocation: [] | [bigint];
}
export interface change {
	timestamp_nanos: bigint;
	canister_version: bigint;
	origin: change_origin;
	details: change_details;
}
export type change_details =
	| {
			creation: { controllers: Array<Principal> };
	  }
	| {
			code_deployment: {
				mode: { reinstall: null } | { upgrade: null } | { install: null };
				module_hash: Uint8Array;
			};
	  }
	| { controllers_change: { controllers: Array<Principal> } }
	| { code_uninstall: null };
export type change_origin =
	| { from_user: { user_id: Principal } }
	| {
			from_canister: {
				canister_version: [] | [bigint];
				canister_id: Principal;
			};
	  };
export interface definite_canister_settings {
	freezing_threshold: bigint;
	controllers: Array<Principal>;
	memory_allocation: bigint;
	compute_allocation: bigint;
}
export type ecdsa_curve = { secp256k1: null };
export interface get_balance_request {
	network: bitcoin_network;
	address: bitcoin_address;
	min_confirmations: [] | [number];
}
export interface get_current_fee_percentiles_request {
	network: bitcoin_network;
}
export interface get_utxos_request {
	network: bitcoin_network;
	filter: [] | [{ page: Uint8Array } | { min_confirmations: number }];
	address: bitcoin_address;
}
export interface get_utxos_response {
	next_page: [] | [Uint8Array];
	tip_height: number;
	tip_block_hash: block_hash;
	utxos: Array<utxo>;
}
export interface http_header {
	value: string;
	name: string;
}
export interface http_response {
	status: bigint;
	body: Uint8Array;
	headers: Array<http_header>;
}
export type millisatoshi_per_byte = bigint;
export interface outpoint {
	txid: Uint8Array;
	vout: number;
}
export type satoshi = bigint;
export interface send_transaction_request {
	transaction: Uint8Array;
	network: bitcoin_network;
}
export interface utxo {
	height: number;
	value: satoshi;
	outpoint: outpoint;
}
export type wasm_module = Uint8Array;
export interface _SERVICE {
	bitcoin_get_balance: ActorMethod<[get_balance_request], satoshi>;
	bitcoin_get_current_fee_percentiles: ActorMethod<[get_current_fee_percentiles_request], BigUint64Array>;
	bitcoin_get_utxos: ActorMethod<[get_utxos_request], get_utxos_response>;
	bitcoin_send_transaction: ActorMethod<[send_transaction_request], undefined>;
	canister_info: ActorMethod<
		[{ canister_id: canister_id; num_requested_changes: [] | [bigint] }],
		{
			controllers: Array<Principal>;
			module_hash: [] | [Uint8Array];
			recent_changes: Array<change>;
			total_num_changes: bigint;
		}
	>;
	canister_status: ActorMethod<
		[{ canister_id: canister_id }],
		{
			status: { stopped: null } | { stopping: null } | { running: null };
			memory_size: bigint;
			cycles: bigint;
			settings: definite_canister_settings;
			idle_cycles_burned_per_day: bigint;
			module_hash: [] | [Uint8Array];
		}
	>;
	create_canister: ActorMethod<
		[
			{
				settings: [] | [canister_settings];
				sender_canister_version: [] | [bigint];
			}
		],
		{ canister_id: canister_id }
	>;
	delete_canister: ActorMethod<[{ canister_id: canister_id }], undefined>;
	deposit_cycles: ActorMethod<[{ canister_id: canister_id }], undefined>;
	ecdsa_public_key: ActorMethod<
		[
			{
				key_id: { name: string; curve: ecdsa_curve };
				canister_id: [] | [canister_id];
				derivation_path: Array<Uint8Array>;
			}
		],
		{ public_key: Uint8Array; chain_code: Uint8Array }
	>;
	http_request: ActorMethod<
		[
			{
				url: string;
				method: { get: null } | { head: null } | { post: null };
				max_response_bytes: [] | [bigint];
				body: [] | [Uint8Array];
				transform: [] | [{ function: [Principal, string]; context: Uint8Array }];
				headers: Array<http_header>;
			}
		],
		http_response
	>;
	install_code: ActorMethod<
		[
			{
				arg: Uint8Array;
				wasm_module: wasm_module;
				mode: { reinstall: null } | { upgrade: null } | { install: null };
				canister_id: canister_id;
				sender_canister_version: [] | [bigint];
			}
		],
		undefined
	>;
	provisional_create_canister_with_cycles: ActorMethod<
		[
			{
				settings: [] | [canister_settings];
				specified_id: [] | [canister_id];
				amount: [] | [bigint];
			}
		],
		{ canister_id: canister_id }
	>;
	provisional_top_up_canister: ActorMethod<[{ canister_id: canister_id; amount: bigint }], undefined>;
	raw_rand: ActorMethod<[], Uint8Array>;
	sign_with_ecdsa: ActorMethod<
		[
			{
				key_id: { name: string; curve: ecdsa_curve };
				derivation_path: Array<Uint8Array>;
				message_hash: Uint8Array;
			}
		],
		{ signature: Uint8Array }
	>;
	start_canister: ActorMethod<[{ canister_id: canister_id }], undefined>;
	stop_canister: ActorMethod<[{ canister_id: canister_id }], undefined>;
	uninstall_code: ActorMethod<
		[
			{
				canister_id: canister_id;
				sender_canister_version: [] | [bigint];
			}
		],
		undefined
	>;
	update_settings: ActorMethod<
		[
			{
				canister_id: Principal;
				settings: canister_settings;
				sender_canister_version: [] | [bigint];
			}
		],
		undefined
	>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const bitcoin_network = IDL.Variant({
		mainnet: IDL.Null,
		testnet: IDL.Null
	});
	const bitcoin_address = IDL.Text;
	const get_balance_request = IDL.Record({
		network: bitcoin_network,
		address: bitcoin_address,
		min_confirmations: IDL.Opt(IDL.Nat32)
	});
	const satoshi = IDL.Nat64;
	const get_current_fee_percentiles_request = IDL.Record({
		network: bitcoin_network
	});
	const millisatoshi_per_byte = IDL.Nat64;
	const get_utxos_request = IDL.Record({
		network: bitcoin_network,
		filter: IDL.Opt(
			IDL.Variant({
				page: IDL.Vec(IDL.Nat8),
				min_confirmations: IDL.Nat32
			})
		),
		address: bitcoin_address
	});
	const block_hash = IDL.Vec(IDL.Nat8);
	const outpoint = IDL.Record({
		txid: IDL.Vec(IDL.Nat8),
		vout: IDL.Nat32
	});
	const utxo = IDL.Record({
		height: IDL.Nat32,
		value: satoshi,
		outpoint: outpoint
	});
	const get_utxos_response = IDL.Record({
		next_page: IDL.Opt(IDL.Vec(IDL.Nat8)),
		tip_height: IDL.Nat32,
		tip_block_hash: block_hash,
		utxos: IDL.Vec(utxo)
	});
	const send_transaction_request = IDL.Record({
		transaction: IDL.Vec(IDL.Nat8),
		network: bitcoin_network
	});
	const canister_id = IDL.Principal;
	const change_origin = IDL.Variant({
		from_user: IDL.Record({ user_id: IDL.Principal }),
		from_canister: IDL.Record({
			canister_version: IDL.Opt(IDL.Nat64),
			canister_id: IDL.Principal
		})
	});
	const change_details = IDL.Variant({
		creation: IDL.Record({ controllers: IDL.Vec(IDL.Principal) }),
		code_deployment: IDL.Record({
			mode: IDL.Variant({
				reinstall: IDL.Null,
				upgrade: IDL.Null,
				install: IDL.Null
			}),
			module_hash: IDL.Vec(IDL.Nat8)
		}),
		controllers_change: IDL.Record({
			controllers: IDL.Vec(IDL.Principal)
		}),
		code_uninstall: IDL.Null
	});
	const change = IDL.Record({
		timestamp_nanos: IDL.Nat64,
		canister_version: IDL.Nat64,
		origin: change_origin,
		details: change_details
	});
	const definite_canister_settings = IDL.Record({
		freezing_threshold: IDL.Nat,
		controllers: IDL.Vec(IDL.Principal),
		memory_allocation: IDL.Nat,
		compute_allocation: IDL.Nat
	});
	const canister_settings = IDL.Record({
		freezing_threshold: IDL.Opt(IDL.Nat),
		controllers: IDL.Opt(IDL.Vec(IDL.Principal)),
		memory_allocation: IDL.Opt(IDL.Nat),
		compute_allocation: IDL.Opt(IDL.Nat)
	});
	const ecdsa_curve = IDL.Variant({ secp256k1: IDL.Null });
	const http_header = IDL.Record({ value: IDL.Text, name: IDL.Text });
	const http_response = IDL.Record({
		status: IDL.Nat,
		body: IDL.Vec(IDL.Nat8),
		headers: IDL.Vec(http_header)
	});
	const wasm_module = IDL.Vec(IDL.Nat8);
	return IDL.Service({
		bitcoin_get_balance: IDL.Func([get_balance_request], [satoshi], []),
		bitcoin_get_current_fee_percentiles: IDL.Func(
			[get_current_fee_percentiles_request],
			[IDL.Vec(millisatoshi_per_byte)],
			[]
		),
		bitcoin_get_utxos: IDL.Func([get_utxos_request], [get_utxos_response], []),
		bitcoin_send_transaction: IDL.Func([send_transaction_request], [], []),
		canister_info: IDL.Func(
			[
				IDL.Record({
					canister_id: canister_id,
					num_requested_changes: IDL.Opt(IDL.Nat64)
				})
			],
			[
				IDL.Record({
					controllers: IDL.Vec(IDL.Principal),
					module_hash: IDL.Opt(IDL.Vec(IDL.Nat8)),
					recent_changes: IDL.Vec(change),
					total_num_changes: IDL.Nat64
				})
			],
			[]
		),
		canister_status: IDL.Func(
			[IDL.Record({ canister_id: canister_id })],
			[
				IDL.Record({
					status: IDL.Variant({
						stopped: IDL.Null,
						stopping: IDL.Null,
						running: IDL.Null
					}),
					memory_size: IDL.Nat,
					cycles: IDL.Nat,
					settings: definite_canister_settings,
					idle_cycles_burned_per_day: IDL.Nat,
					module_hash: IDL.Opt(IDL.Vec(IDL.Nat8))
				})
			],
			[]
		),
		create_canister: IDL.Func(
			[
				IDL.Record({
					settings: IDL.Opt(canister_settings),
					sender_canister_version: IDL.Opt(IDL.Nat64)
				})
			],
			[IDL.Record({ canister_id: canister_id })],
			[]
		),
		delete_canister: IDL.Func([IDL.Record({ canister_id: canister_id })], [], []),
		deposit_cycles: IDL.Func([IDL.Record({ canister_id: canister_id })], [], []),
		ecdsa_public_key: IDL.Func(
			[
				IDL.Record({
					key_id: IDL.Record({ name: IDL.Text, curve: ecdsa_curve }),
					canister_id: IDL.Opt(canister_id),
					derivation_path: IDL.Vec(IDL.Vec(IDL.Nat8))
				})
			],
			[
				IDL.Record({
					public_key: IDL.Vec(IDL.Nat8),
					chain_code: IDL.Vec(IDL.Nat8)
				})
			],
			[]
		),
		http_request: IDL.Func(
			[
				IDL.Record({
					url: IDL.Text,
					method: IDL.Variant({
						get: IDL.Null,
						head: IDL.Null,
						post: IDL.Null
					}),
					max_response_bytes: IDL.Opt(IDL.Nat64),
					body: IDL.Opt(IDL.Vec(IDL.Nat8)),
					transform: IDL.Opt(
						IDL.Record({
							function: IDL.Func(
								[
									IDL.Record({
										context: IDL.Vec(IDL.Nat8),
										response: http_response
									})
								],
								[http_response],
								['query']
							),
							context: IDL.Vec(IDL.Nat8)
						})
					),
					headers: IDL.Vec(http_header)
				})
			],
			[http_response],
			[]
		),
		install_code: IDL.Func(
			[
				IDL.Record({
					arg: IDL.Vec(IDL.Nat8),
					wasm_module: wasm_module,
					mode: IDL.Variant({
						reinstall: IDL.Null,
						upgrade: IDL.Null,
						install: IDL.Null
					}),
					canister_id: canister_id,
					sender_canister_version: IDL.Opt(IDL.Nat64)
				})
			],
			[],
			[]
		),
		provisional_create_canister_with_cycles: IDL.Func(
			[
				IDL.Record({
					settings: IDL.Opt(canister_settings),
					specified_id: IDL.Opt(canister_id),
					amount: IDL.Opt(IDL.Nat)
				})
			],
			[IDL.Record({ canister_id: canister_id })],
			[]
		),
		provisional_top_up_canister: IDL.Func([IDL.Record({ canister_id: canister_id, amount: IDL.Nat })], [], []),
		raw_rand: IDL.Func([], [IDL.Vec(IDL.Nat8)], []),
		sign_with_ecdsa: IDL.Func(
			[
				IDL.Record({
					key_id: IDL.Record({ name: IDL.Text, curve: ecdsa_curve }),
					derivation_path: IDL.Vec(IDL.Vec(IDL.Nat8)),
					message_hash: IDL.Vec(IDL.Nat8)
				})
			],
			[IDL.Record({ signature: IDL.Vec(IDL.Nat8) })],
			[]
		),
		start_canister: IDL.Func([IDL.Record({ canister_id: canister_id })], [], []),
		stop_canister: IDL.Func([IDL.Record({ canister_id: canister_id })], [], []),
		uninstall_code: IDL.Func(
			[
				IDL.Record({
					canister_id: canister_id,
					sender_canister_version: IDL.Opt(IDL.Nat64)
				})
			],
			[],
			[]
		),
		update_settings: IDL.Func(
			[
				IDL.Record({
					canister_id: IDL.Principal,
					settings: canister_settings,
					sender_canister_version: IDL.Opt(IDL.Nat64)
				})
			],
			[],
			[]
		)
	});
};
