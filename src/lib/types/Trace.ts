import { Principal } from '@dfinity/principal';

export interface Trace {
	id: number;
	status: TraceStatus;
	duration: number;
	nodeId: number;
	data: Record<string, unknown>;
	errors: Array<TraceError>;
	createdAt: Date;
	userId: Principal;
	circuitId: number;
	completedAt: Date;
	startedAt: Date;
	updatedAt: Date;
}

export type TraceStatus = 'Failed' | 'Success' | 'InProgress' | 'Cancelled';

export interface TraceError {
	code: string;
	message: string;
	source: string;
	resolvedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}
