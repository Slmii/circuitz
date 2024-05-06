import Handlebars from 'handlebars';
import H from 'just-handlebars-helpers';

H.registerHelpers(Handlebars);

Handlebars.registerHelper('json', function (context) {
	return JSON.stringify(context);
});

export const isHandlebarsTemplate = (str: string) => {
	return str.includes('{{') && str.includes('}}');
};

export const getHandlebars = <I, C>(input: I, context: C) => {
	try {
		const template = Handlebars.compile(input);
		const result = template(context);

		return result;
	} catch (error) {
		return (error as Error).message;
	}
};
