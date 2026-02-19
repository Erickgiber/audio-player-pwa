export const ssr = false;
export const prerender = false;
export const csr = true;
export const trailingSlash = 'ignore';

export async function load({ fetch }) {
	return {
		title: 'Music Player PWA',
		description: 'A modern, responsive music player PWA with offline support'
	};
}
