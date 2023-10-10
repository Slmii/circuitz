import type { Node as OldNode } from 'declarations/nodes.declarations';
import type { Node } from 'lib/types';
import { dateFromNano } from './date.utils';

export const mapToNode = (circuit: OldNode): Node => {
	return {
		id: circuit.id,
		circuitId: circuit.circuit_id,
		userId: circuit.user_id,
		pin: circuit.pin,
		nodeType: circuit.node_type,
		order: circuit.order,
		isFinished: circuit.is_finished,
		isError: circuit.is_error,
		isActive: circuit.is_active,
		createdAt: dateFromNano(circuit.created_at),
		updatedAt: dateFromNano(circuit.updated_at)
	};
};
