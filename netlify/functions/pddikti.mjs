const API_BASE = 'https://pddikti.fastapicloud.dev/api';

export const handler = async (event) => {
	const path = event.path.replace('/.netlify/functions/pddikti/', '');
	const query = event.rawQuery;
	const url = `${API_BASE}/${path}${query ? '?' + query : ''}`;

	try {
		const res = await fetch(url, { redirect: 'follow' });
		const body = await res.text();
		return {
			statusCode: res.status,
			headers: { 'Content-Type': 'application/json' },
			body
		};
	} catch (e) {
		return {
			statusCode: 502,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ error: 'Gagal menghubungi PDDikti API' })
		};
	}
};
