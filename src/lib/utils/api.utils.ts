import { HttpRequest } from 'declarations/canister.declarations';

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
		return response.json();
	} catch (error) {
		return error;
	}
};
