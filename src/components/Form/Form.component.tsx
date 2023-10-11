import { yupResolver } from '@hookform/resolvers/yup';
import FormGroup from '@mui/material/FormGroup';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { FormProps } from './Form.types';
import { useEffect } from 'react';

export function Form<T extends FieldValues>({
	children,
	action,
	schema,
	defaultValues,
	mode = 'onBlur',
	render,
	myRef,
	isDefaultValuesLoading
}: FormProps<T>) {
	const methods = useForm<T>({
		resolver: schema ? yupResolver(schema) : undefined,
		defaultValues,
		mode
	});

	useEffect(() => {
		if (typeof isDefaultValuesLoading !== 'undefined' && !isDefaultValuesLoading) {
			methods.reset(defaultValues);
		}
	}, [defaultValues, isDefaultValuesLoading, methods]);

	return (
		<FormProvider {...methods}>
			<form onSubmit={methods.handleSubmit(action)} ref={myRef}>
				<FormGroup
					sx={{
						'& > *:not(:last-child)': {
							marginBottom: theme => theme.spacing(4)
						}
					}}
				>
					{render ? render(methods) : children}
				</FormGroup>
			</form>
		</FormProvider>
	);
}
