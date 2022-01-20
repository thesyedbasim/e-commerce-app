import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			resolve: {
				alias: {
					$store: resolve('./src/lib/store'),
					$types: resolve('./src/lib/types'),
					$utils: resolve('./src/utils'),
					'@components': resolve('./src/components')
				}
			}
		},

		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte'
	}
};

export default config;
