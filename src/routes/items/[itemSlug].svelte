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
	import { addItemToCart } from '$lib/store/cartStore';

	export let item;

	const addItem = () => {
		addItemToCart(item);
	};
</script>

<h1>Item name: {item.doc.name}</h1>

<button class="btn btn-primary" on:click={addItem}>add item to cart</button>
