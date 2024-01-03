import { Stack } from '@mui/material';
import { Form } from 'components/Form';
import { Option } from 'components/Form/Select';
import { Node } from 'lib/types';
import { RefObject, useMemo } from 'react';
import { FilterPinFormValues } from '../NodeDrawers.types';
import { useGetCircuitNodes, useGetParam, useGetSampleData } from 'lib/hooks';
import { getSampleDataFields, getFilterPinFormValues, getPin } from 'lib/utils';
import { FilterPin, Pin } from 'declarations/nodes.declarations';
import { filterPinSchema } from 'lib/schemas';

export const MapperPinDrawerForm = ({ formRef, node }: { formRef: RefObject<HTMLFormElement>; node: Node }) => {
	const action = useGetParam('action');
	const circuitId = useGetParam('circuitId');

	const circuitIdToNumber = Number(circuitId);
	const { data: circuitNodes } = useGetCircuitNodes(circuitIdToNumber);
	const { data: sampleData } = useGetSampleData(
		{ circuitId: circuitIdToNumber, nodes: circuitNodes ?? [] },
		{
			enabled: !!circuitNodes?.length
		}
	);

	const fields = useMemo(() => {
		if (!sampleData) {
			return [];
		}

		return getSampleDataFields(sampleData);
	}, [sampleData]);

	console.log({ circuitNodes, sampleData, fields });

	return (
		<Form<FilterPinFormValues>
			action={() => {}}
			defaultValues={{}}
			schema={filterPinSchema}
			myRef={formRef}
			render={({ getValues, setValue }) => <Stack direction="row" spacing={4} height="100%"></Stack>}
		/>
	);
};
