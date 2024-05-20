import { yupResolver } from '@hookform/resolvers/yup';
import FormGroup from '@mui/material/FormGroup';
import { DefaultValues, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { FormProps } from './Form.types';
import { useSetRecoilState } from 'recoil';
import { isFormDirtyState } from 'lib/recoil';
import { useEffect } from 'react';

export function Form<T extends FieldValues>({
	children,
	action,
	schema,
	defaultValues,
	mode = 'onBlur',
	render,
	myRef
}: FormProps<T>) {
	const methods = useForm<T>({
		resolver: schema ? yupResolver(schema) : undefined,
		defaultValues: getDefaultValues(defaultValues),
		mode
	});

	const setisFormDirtyState = useSetRecoilState(isFormDirtyState);

	useEffect(() => {
		setisFormDirtyState(methods.formState.isDirty);
	}, [methods.formState.isDirty, setisFormDirtyState]);

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

function getDefaultValues<T>(defaultValues: DefaultValues<T> | (() => DefaultValues<T>)) {
	let values: DefaultValues<T>;
	if (typeof defaultValues === 'function') {
		values = (defaultValues as () => DefaultValues<T>)(); // Call if it's a function
	} else {
		values = defaultValues; // Directly use it if it's not a function
	}

	return values;
}
