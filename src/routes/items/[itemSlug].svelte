<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { getOneDoc } from '$lib/firebase';
	import type { Item } from '$lib/types/item';

	export const load: Load = async ({ params }) => {
		const { itemSlug } = params;

		const getItemData = async () => {
			const { data } = await getOneDoc<Item>({
				path: `items/${itemSlug}`
			});

			console.log('data', data);

			return data;
		};

		return {
			props: {
				item: await getItemData()
			}
		};
	};
</script>

<script lang="ts">
	export let item;
</script>

<h1>Item name: {item.doc.name}</h1>
