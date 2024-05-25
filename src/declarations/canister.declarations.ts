import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ApiError =
	| { NotFound: string }
	| { Unauthorized: string }
	| { AlreadyExists: string }
	| { InterCanister: string };
export type Authentication = { JWT: JWTConfig } | { None: null } | { Basic: [string, string] } | { Token: TokenConfig };
export interface Circuit {
	id: number;
	updated_at: bigint;
	run_at: [] | [bigint];
	name: string;
	is_enabled: boolean;
	description: [] | [string];
	created_at: bigint;
	user_id: Principal;
	is_favorite: boolean;
	node_canister_id: Principal;
	is_running: boolean;
}
export interface Connector {
	id: number;
	updated_at: bigint;
	connector_type: ConnectorType;
	name: string;
	created_at: bigint;
	user_id: Principal;
}
export type ConnectorType = { Http: HttpConnector } | { Canister: string };
export interface HttpConnector {
	authentication: Authentication;
	base_url: string;
	test_connection: [] | [TestConnection];
	headers: Array<[string, string]>;
}
export type HttpRequestMethod = { GET: null } | { PUT: null } | { DELETE: null } | { POST: null };
export interface JWTConfig {
	signature_method: SignatureMethod;
	secret: string;
	sample_data: string;
	secret_key: string;
	location: TokenLocation;
	payload: string;
}
export interface PostCircuit {
	name: string;
	description: [] | [string];
}
export interface PostConnector {
	connector_type: ConnectorType;
	name: string;
}
export type Result = { Ok: Circuit } | { Err: ApiError };
export type Result_1 = { Ok: Connector } | { Err: ApiError };
export type Result_2 = { Ok: User } | { Err: ApiError };
export type Result_3 = { Ok: Array<Trace> } | { Err: ApiError };
export type Result_4 = { Ok: Principal } | { Err: ApiError };
export type Result_5 = { Ok: Array<Circuit> } | { Err: ApiError };
export type Result_6 = { Ok: Array<Connector> } | { Err: ApiError };
export type Result_7 = { Ok: Array<User> } | { Err: ApiError };
export type SignatureMethod =
	| { RS256: null }
	| { RS384: null }
	| { RS512: null }
	| { HS256: null }
	| { HS384: null }
	| { HS512: null }
	| { ES256: null }
	| { ES384: null }
	| { ES512: null };
export interface TestConnection {
	method: HttpRequestMethod;
	error: [] | [[string, string]];
	relative_url: string;
}
export interface TokenConfig {
	token: string;
	location: TokenLocation;
}
export type TokenLocation = { HTTPHeader: [string, string] } | { Query: string };
export interface Trace {
	id: number;
	status: TraceStatus;
	updated_at: bigint;
	duration: number;
	node_id: number;
	data: string;
	errors: Array<TraceError>;
	created_at: bigint;
	user_id: Principal;
	completed_at: bigint;
	started_at: bigint;
	circuit_id: number;
}
export interface TraceError {
	updated_at: bigint;
	source: string;
	code: string;
	created_at: bigint;
	message: string;
	resolved_at: [] | [bigint];
}
export type TraceStatus = { Failed: null } | { Success: null } | { Cancelled: null } | { InProgress: null };
export interface User {
	circuits: Uint32Array | number[];
	username: [] | [string];
	created_at: bigint;
	user_id: Principal;
}
export interface _SERVICE {
	__get_candid_interface_tmp_hack: ActorMethod<[], string>;
	add_circuit: ActorMethod<[PostCircuit], Result>;
	add_connector: ActorMethod<[PostConnector], Result_1>;
	create_user: ActorMethod<[[] | [string]], Result_2>;
	disable_circuit: ActorMethod<[number], Result>;
	edit_circuit: ActorMethod<[number, PostCircuit], Result>;
	edit_connector: ActorMethod<[number, PostConnector], Result_1>;
	enable_circuit: ActorMethod<[number], Result>;
	get_circuit: ActorMethod<[number], Result>;
	get_circuit_traces: ActorMethod<[number], Result_3>;
	get_node_canister_id: ActorMethod<[number], Result_4>;
	get_user: ActorMethod<[], Result_2>;
	get_user_circuits: ActorMethod<[], Result_5>;
	get_user_connectors: ActorMethod<[], Result_6>;
	get_users: ActorMethod<[], Result_7>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const idlFactory = ({ IDL }: any) => {
	const PostCircuit = IDL.Record({
		name: IDL.Text,
		description: IDL.Opt(IDL.Text)
	});
	const Circuit = IDL.Record({
		id: IDL.Nat32,
		updated_at: IDL.Nat64,
		run_at: IDL.Opt(IDL.Nat64),
		name: IDL.Text,
		is_enabled: IDL.Bool,
		description: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		is_favorite: IDL.Bool,
		node_canister_id: IDL.Principal,
		is_running: IDL.Bool
	});
	const ApiError = IDL.Variant({
		NotFound: IDL.Text,
		Unauthorized: IDL.Text,
		AlreadyExists: IDL.Text,
		InterCanister: IDL.Text
	});
	const Result = IDL.Variant({ Ok: Circuit, Err: ApiError });
	const SignatureMethod = IDL.Variant({
		RS256: IDL.Null,
		RS384: IDL.Null,
		RS512: IDL.Null,
		HS256: IDL.Null,
		HS384: IDL.Null,
		HS512: IDL.Null,
		ES256: IDL.Null,
		ES384: IDL.Null,
		ES512: IDL.Null
	});
	const TokenLocation = IDL.Variant({
		HTTPHeader: IDL.Tuple(IDL.Text, IDL.Text),
		Query: IDL.Text
	});
	const JWTConfig = IDL.Record({
		signature_method: SignatureMethod,
		secret: IDL.Text,
		sample_data: IDL.Text,
		secret_key: IDL.Text,
		location: TokenLocation,
		payload: IDL.Text
	});
	const TokenConfig = IDL.Record({
		token: IDL.Text,
		location: TokenLocation
	});
	const Authentication = IDL.Variant({
		JWT: JWTConfig,
		None: IDL.Null,
		Basic: IDL.Tuple(IDL.Text, IDL.Text),
		Token: TokenConfig
	});
	const HttpRequestMethod = IDL.Variant({
		GET: IDL.Null,
		PUT: IDL.Null,
		DELETE: IDL.Null,
		POST: IDL.Null
	});
	const TestConnection = IDL.Record({
		method: HttpRequestMethod,
		error: IDL.Opt(IDL.Tuple(IDL.Text, IDL.Text)),
		relative_url: IDL.Text
	});
	const HttpConnector = IDL.Record({
		authentication: Authentication,
		base_url: IDL.Text,
		test_connection: IDL.Opt(TestConnection),
		headers: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))
	});
	const ConnectorType = IDL.Variant({
		Http: HttpConnector,
		Canister: IDL.Text
	});
	const PostConnector = IDL.Record({
		connector_type: ConnectorType,
		name: IDL.Text
	});
	const Connector = IDL.Record({
		id: IDL.Nat32,
		updated_at: IDL.Nat64,
		connector_type: ConnectorType,
		name: IDL.Text,
		created_at: IDL.Nat64,
		user_id: IDL.Principal
	});
	const Result_1 = IDL.Variant({ Ok: Connector, Err: ApiError });
	const User = IDL.Record({
		circuits: IDL.Vec(IDL.Nat32),
		username: IDL.Opt(IDL.Text),
		created_at: IDL.Nat64,
		user_id: IDL.Principal
	});
	const Result_2 = IDL.Variant({ Ok: User, Err: ApiError });
	const TraceStatus = IDL.Variant({
		Failed: IDL.Null,
		Success: IDL.Null,
		Cancelled: IDL.Null,
		InProgress: IDL.Null
	});
	const TraceError = IDL.Record({
		updated_at: IDL.Nat64,
		source: IDL.Text,
		code: IDL.Text,
		created_at: IDL.Nat64,
		message: IDL.Text,
		resolved_at: IDL.Opt(IDL.Nat64)
	});
	const Trace = IDL.Record({
		id: IDL.Nat32,
		status: TraceStatus,
		updated_at: IDL.Nat64,
		duration: IDL.Nat32,
		node_id: IDL.Nat32,
		data: IDL.Text,
		errors: IDL.Vec(TraceError),
		created_at: IDL.Nat64,
		user_id: IDL.Principal,
		completed_at: IDL.Nat64,
		started_at: IDL.Nat64,
		circuit_id: IDL.Nat32
	});
	const Result_3 = IDL.Variant({ Ok: IDL.Vec(Trace), Err: ApiError });
	const Result_4 = IDL.Variant({ Ok: IDL.Principal, Err: ApiError });
	const Result_5 = IDL.Variant({ Ok: IDL.Vec(Circuit), Err: ApiError });
	const Result_6 = IDL.Variant({ Ok: IDL.Vec(Connector), Err: ApiError });
	const Result_7 = IDL.Variant({ Ok: IDL.Vec(User), Err: ApiError });
	return IDL.Service({
		__get_candid_interface_tmp_hack: IDL.Func([], [IDL.Text], ['query']),
		add_circuit: IDL.Func([PostCircuit], [Result], []),
		add_connector: IDL.Func([PostConnector], [Result_1], []),
		create_user: IDL.Func([IDL.Opt(IDL.Text)], [Result_2], []),
		disable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		edit_circuit: IDL.Func([IDL.Nat32, PostCircuit], [Result], []),
		edit_connector: IDL.Func([IDL.Nat32, PostConnector], [Result_1], []),
		enable_circuit: IDL.Func([IDL.Nat32], [Result], []),
		get_circuit: IDL.Func([IDL.Nat32], [Result], ['query']),
		get_circuit_traces: IDL.Func([IDL.Nat32], [Result_3], ['query']),
		get_node_canister_id: IDL.Func([IDL.Nat32], [Result_4], ['query']),
		get_user: IDL.Func([], [Result_2], ['query']),
		get_user_circuits: IDL.Func([], [Result_5], ['query']),
		get_user_connectors: IDL.Func([], [Result_6], ['query']),
		get_users: IDL.Func([], [Result_7], ['query'])
	});
};
