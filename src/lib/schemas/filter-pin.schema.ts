import { FilterRule } from 'components/NodeDrawers';
import { FORM_ERRORS } from 'lib/constants';
import { OperandType } from 'lib/types';
import { isHandlebarsTemplate } from 'lib/utils';
import * as yup from 'yup';

const isHandlebarsTest = (value?: string) => {
	if (!value) {
		return false;
	}

	return isHandlebarsTemplate(value);
};

export const filterPinSchema = yup.object().shape({
	inputSampleData: yup.string().required(FORM_ERRORS.required),
	condition: yup.string().oneOf(['Is', 'Not']).required(FORM_ERRORS.required),
	conditionGroup: yup.string().when('rules', {
		is: (rules: FilterRule[]) => rules.length > 1,
		then: schema => schema.oneOf(['And', 'Or'], FORM_ERRORS.selection).required(FORM_ERRORS.selection),
		otherwise: schema => schema.nullable()
	}),
	rules: yup.array().of(
		yup.object({
			field: yup.string().test('is-handlebars', FORM_ERRORS.handlebars, isHandlebarsTest),
			operator: yup.string().required(FORM_ERRORS.selection),
			operandType: yup.string().required(FORM_ERRORS.selection),
			dataType: yup.string().required(FORM_ERRORS.selection),
			value: yup.string().when('operandType', {
				is: (type: OperandType) => type === 'Field',
				then: schema => schema.test('is-handlebars', FORM_ERRORS.handlebars, isHandlebarsTest),
				otherwise: schema => schema.required(FORM_ERRORS.required)
			})
		})
	)
});
