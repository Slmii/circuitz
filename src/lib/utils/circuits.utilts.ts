import type { Circuit as OldCircuit } from 'declarations/circuits.declarations';
import type { Circuit } from 'lib/types';
import { dateFromNano } from './date.utils';

export const mapToCircuit = (circuit: OldCircuit): Circuit => {
	return {
		id: circuit.id,
		name: circuit.name,
		description: circuit.description[0] ?? '',
		isFavorite: circuit.is_favorite,
		userId: circuit.user_id,
		createdAt: dateFromNano(circuit.created_at),
		updatedAt: dateFromNano(circuit.updated_at)
	};
};
