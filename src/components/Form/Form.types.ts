import { ReactNode, Ref } from 'react';
import { DefaultValues, FieldValues, Mode, SubmitHandler, UseFormReturn } from 'react-hook-form';
import { AnyObjectSchema } from 'yup';

export interface FormProps<T extends FieldValues> {
	/**
	 * Function to execute on form submit
	 */
	action: SubmitHandler<T>;
	/**
	 * Validator schema. Either a joi or yup schema.
	 */
	schema?: AnyObjectSchema;
	/**
	 * Default values in a form
	 */
	defaultValues: (() => DefaultValues<T>) | DefaultValues<T>;
	/**
	 * Option to configure the validation before onSubmit event
	 */
	mode?: Mode;
	/**
	 * Render all JSX elements with this prop. Using this prop will make react hook form props
	 * available as parameters to use, example `getValues, formState`.
	 *
	 * Using this prop will also ignore direct children,
	 */
	render?: (props: UseFormReturn<T>) => JSX.Element;
	/**
	 * Optional ref. This is necessary if you want to submit the form outside the form component
	 * itself, example a Dialog component.
	 */
	myRef?: Ref<HTMLFormElement>;
	children?: ReactNode;
	/**
	 * In case the values are being loaded from an API, this prop will reset the form with the default values
	 * when the prop changes.
	 */
	isDefaultValuesLoading?: boolean;
}
