import type { Node as OldNode } from 'declarations/nodes.declarations';
import type { Node } from 'lib/types';
import { dateFromNano } from './date.utils';

export const mapToNode = (circuit: OldNode): Node => {
	return {
		id: circuit.id,
		circuitId: circuit.circuit_id,
		userId: circuit.user_id,
		name: circuit.name,
		pin: circuit.pin,
		nodeType: circuit.node_type,
		order: circuit.order,
		isFinished: circuit.is_finished,
		isError: circuit.is_error,
		isEnabled: circuit.is_enabled,
		createdAt: dateFromNano(circuit.created_at),
		updatedAt: dateFromNano(circuit.updated_at)
	};
};
