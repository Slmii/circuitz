import { useAddPin, useEditPin, useFormSubmit, useModal } from 'lib/hooks';
import { Drawer } from 'components/Drawer';
import { DeletePinModalProps, Node, PinSourceType } from 'lib/types';
import { Pin } from 'declarations/nodes.declarations';
import { MapperPinDrawerForm } from './MapperPinDrawerForm.component';
import { Stack } from '@mui/material';
import { H3, H5 } from 'components/Typography';
import { getNodeMetaData } from 'lib/utils';

export const MapperPinDrawer = ({
	open,
	pinType,
	node,
	onClose
}: {
	open: boolean;
	pinType: PinSourceType;
	node?: Node;
	onClose: () => void;
}) => {
	const { formRef, submitter } = useFormSubmit();
	const { openModal } = useModal<DeletePinModalProps>('DELETE_PIN');

	const { mutateAsync: addPin, isPending: isAddPinPending } = useAddPin();
	const { mutateAsync: editPin, isPending: isEditPinPending } = useEditPin();

	const mapperPin = node?.pins.find(pin => pinType in pin.pin_type);

	const handleOnSubmit = async (pin: Pin) => {
		if (!node) {
			return;
		}

		if (!mapperPin) {
			await addPin({
				nodeId: node.id,
				data: pin
			});
		} else {
			await editPin({
				nodeId: node.id,
				data: pin
			});
		}
	};

	return (
		<Drawer
			onClose={onClose}
			onSubmit={submitter}
			isOpen={open}
			isLoading={isAddPinPending || isEditPinPending}
			title={
				<Stack>
					<H3>{pinType} Pin</H3>
					{node && <H5 fontWeight="bold">{getNodeMetaData(node).name}</H5>}
				</Stack>
			}
			fullWidth
			onDelete={() => {
				if (!node || !mapperPin) {
					return;
				}

				openModal({
					nodeId: node.id,
					pin: mapperPin,
					onSuccess: () => onClose()
				});
			}}
		>
			{!!node && open && (
				<MapperPinDrawerForm
					mapperType={pinType as 'PreMapperPin' | 'PostMapperPin'}
					formRef={formRef}
					node={node}
					onProcessMapper={handleOnSubmit}
				/>
			)}
		</Drawer>
	);
};
