<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { getOneDoc } from '$lib/firebase';
	import type { Item, ItemCart } from '$lib/types/item';

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
	import { addItemToCart } from '$store/cartStore';
	import type { ItemDoc } from '$types/item';

	let qty: number = 1;
	export let item: ItemDoc;
	$: itemCart = { id: item.id, doc: { ...item.doc }, quantity: qty } as ItemCart;

	const addItem = () => {
		addItemToCart(itemCart);
	};
</script>

<h1>{item.doc.name}</h1>
<h3>${item.doc.price}</h3>

<label for="qty" />
<input type="number" id="qty" bind:value={qty} />

<button class="btn btn-primary" on:click={addItem} disabled={qty < 1 || qty > item.doc.itemsInStock}
	>add item to cart</button
>
