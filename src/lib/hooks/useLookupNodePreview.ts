import { useFormContext } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useGetCircuitNodes } from './useNodes';
import { useEffect } from 'react';
import { generateNodeIndexKey, parseJson, stringifyJson } from 'lib/utils';
import { NodeSourceType, SampleData } from 'lib/types';
import { ApiError } from 'declarations/nodes.declarations';

export const useLookupNodePreview = ({
	nodeType,
	data,
	error
}: {
	nodeType: NodeSourceType;
	data?: { Ok: string } | { Err: ApiError };
	error: Error | null;
}) => {
	const { getValues, setValue } = useFormContext();

	const { circuitId, nodeId } = useParams<{
		circuitId: string;
		nodeId: string;
	}>();
	const { data: circuitNodes } = useGetCircuitNodes(Number(circuitId));

	useEffect(() => {
		if (!data || !nodeId || !circuitNodes) {
			return;
		}

		const index = circuitNodes.findIndex(({ id }) => id === Number(nodeId));
		const key = generateNodeIndexKey(index ?? 0);
		const inputSampleData = parseJson<SampleData>(getValues('inputSampleData'));

		let values = {};

		if (error) {
			values = error;
		} else if ('Ok' in data) {
			values = JSON.parse(data.Ok);
		} else {
			values = data;
		}

		setValue(
			'inputSampleData',
			stringifyJson({
				...inputSampleData,
				[key]: {
					...inputSampleData[key],
					[nodeType]: values
				}
			})
		);
	}, [circuitNodes, data, error, getValues, nodeId, nodeType, setValue]);
};
