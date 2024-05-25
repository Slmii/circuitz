import { FormLabel, Paper, Stack } from '@mui/material';
import { Button } from 'components/Button';
import { Field } from 'components/Form/Field';
import { IconButton } from 'components/IconButton';
import { LookupHttpRequestFormValues } from 'components/NodeDrawers';
import { useFieldArray } from 'react-hook-form';

export const HttpRequestHeaders = () => {
	const { fields, append, remove } = useFieldArray<LookupHttpRequestFormValues>({
		name: 'headers'
	});

	return (
		<Paper sx={{ p: 2 }}>
			<Stack direction="column" spacing={2}>
				<FormLabel>HTTP Headers</FormLabel>
				<Stack direction="column" spacing={2}>
					{fields.map((config, index) => (
						<Stack direction="row" spacing={1} key={config.id} alignItems="center">
							<Field fullWidth name={`headers.${index}.key`} label="Header" placeholder="Content-Type" />
							<Field fullWidth name={`headers.${index}.value`} label="Value" placeholder="application/json" />
							<IconButton
								icon="close-linear"
								tooltip="Remove HTTP Header"
								color="error"
								onClick={() => remove(index)}
							/>
						</Stack>
					))}
					<Button
						startIcon="add-linear"
						sx={{ width: 'fit-content' }}
						variant="outlined"
						size="large"
						onClick={() => append({ key: '', value: '' }, { shouldFocus: false })}
					>
						{!fields.length ? 'Add first HTTP Header' : 'Add HTTP Header'}
					</Button>
				</Stack>
			</Stack>
		</Paper>
	);
};
