import { HttpRequest } from 'declarations/nodes.declarations';

export const httpRequest = async (request: HttpRequest) => {
	const requestBodyAsString = request.request_body[0] ? request.request_body[0] : '{}';

	const headers = request.headers.reduce(
		(acc, header) => {
			acc[header[0]] = header[1];
			return acc;
		},
		{} as Record<string, string>
	);

	try {
		const response = await fetch(request.url, {
			method: 'GET' in request.method ? 'GET' : 'POST',
			body: JSON.parse(requestBodyAsString),
			headers
		});
		const data = await response.json();
		return data;
	} catch (error) {
		return error;
	}
};