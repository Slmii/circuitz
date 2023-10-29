import { FilterRule } from 'components/NodeDrawers';
import { FORM_ERRORS } from 'lib/constants';
import { OperandType } from 'lib/types';
import * as yup from 'yup';

export const filterPinSchema = yup.object().shape({
	condition: yup.string().oneOf(['Is', 'Not']).required(FORM_ERRORS.required),
	conditionGroup: yup.string().when('rules', {
		is: (rules: FilterRule[]) => rules.length > 1,
		then: schema => schema.oneOf(['And', 'Or'], FORM_ERRORS.selection).required(FORM_ERRORS.selection),
		otherwise: schema => schema.nullable()
	}),
	rules: yup.array().of(
		yup.object({
			field: yup.string().required(FORM_ERRORS.selection),
			operator: yup.string().required(FORM_ERRORS.selection),
			operandType: yup.string().required(FORM_ERRORS.selection),
			dataType: yup.string().required(FORM_ERRORS.selection),
			value: yup.string().when('operandType', {
				is: (type: OperandType) => type === 'Field',
				then: schema => schema.required(FORM_ERRORS.selection),
				otherwise: schema => schema.required(FORM_ERRORS.required)
			})
		})
	)
});
