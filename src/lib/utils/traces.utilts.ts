import type {
	Trace as OldTrace,
	TraceError as OldTraceError,
	TraceStatus as OldTraceStatus
} from 'declarations/traces.declarations';
import type { Trace, TraceError, TraceStatus } from 'lib/types';
import { dateFromNano } from './date.utils';

export const mapToTrace = (trace: OldTrace): Trace => {
	return {
		id: trace.id,
		userId: trace.user_id,
		circuitId: trace.circuit_id,
		duration: trace.duration,
		errors: trace.errors.map(mapToTraceErrors),
		nodeId: trace.node_id,
		data: JSON.parse(trace.data) as Record<string, unknown>,
		status: mapToTraceStatus(trace.status),
		startedAt: dateFromNano(trace.started_at),
		completedAt: dateFromNano(trace.completed_at),
		createdAt: dateFromNano(trace.created_at),
		updatedAt: dateFromNano(trace.updated_at)
	};
};

export const mapToTraceErrors = (trace: OldTraceError): TraceError => {
	return {
		code: trace.code,
		message: trace.message,
		source: trace.source,
		resolvedAt: trace.resolved_at[0] ? dateFromNano(trace.resolved_at[0]) : undefined,
		createdAt: dateFromNano(trace.created_at),
		updatedAt: dateFromNano(trace.updated_at)
	};
};

export const mapToTraceStatus = (trace: OldTraceStatus): TraceStatus => {
	if ('Failed' in trace) {
		return 'Failed';
	}

	if ('Success' in trace) {
		return 'Success';
	}

	if ('InProgress' in trace) {
		return 'InProgress';
	}

	return 'Cancelled';
};
