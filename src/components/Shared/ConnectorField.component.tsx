import { Stack } from '@mui/material';
import { SelectAutocomplete } from 'components/Form/SelectAutocomplete';
import { IconButton } from 'components/IconButton';
import { CONNECTOR_HELP_TEXT } from 'lib/constants';
import { useGetConnectors, useModal } from 'lib/hooks';
import { ConnectorModalProps, Node } from 'lib/types';
import { useFormContext } from 'react-hook-form';

export const ConnectorField = ({ node }: { node?: Node }) => {
	const { watch, setValue } = useFormContext<{ connector: string }>();
	const { openModal } = useModal<ConnectorModalProps, string>('CONNECTOR');
	const { data: connectors, isLoading: isConnectorsLoading } = useGetConnectors();

	return (
		<SelectAutocomplete
			name="connector"
			label="Connector"
			isOptionsLoading={!!connectors && isConnectorsLoading}
			options={(connectors ?? []).map(connector => ({
				id: connector.id.toString(),
				label: connector.name
			}))}
			outsideElement={
				<Stack direction="row">
					{watch('connector') && (
						<IconButton
							icon="edit-linear"
							tooltip="Edit Connector"
							onClick={() => {
								const connector = connectors?.find(connector => connector.id === Number(watch('connector')));

								if (!connector) {
									return;
								}

								openModal({
									node,
									connector
								});
							}}
						/>
					)}
					<IconButton
						icon="add-linear"
						tooltip="New Connector"
						onClick={() =>
							openModal({
								node,
								onSuccess: connectorId => connectorId && setValue('connector', connectorId)
							})
						}
					/>
				</Stack>
			}
			helperText={CONNECTOR_HELP_TEXT}
		/>
	);
};
