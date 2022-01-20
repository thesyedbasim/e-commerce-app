<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import { getManyDocs } from '$lib/firebase';
	import type { Item } from '$lib/types/item';

	export const load: Load = async ({ params }) => {
		const { categorySlug } = params;

		const getItemsData = async () => {
			const { data } = await getManyDocs<Item>({
				path: 'items',
				condition: ['category', '==', categorySlug]
			});

			return data;
		};

		return {
			props: {
				items: await getItemsData()
			}
		};
	};
</script>

<script lang="ts">
	import type { ItemDoc } from '$types/item';
	import ItemCategory from '@components/item/Item.svelte';

	let price = 0;

	export let items: ItemDoc[];
	$: filteredItems = items.filter((item) => (price && price > 0 ? item.doc.price <= price : true));
</script>

<div class="row">
	<div class="col-4">
		<form on:submit|preventDefault={() => {}} class="form">
			<div class="form-group">
				<label for="price">max price</label>
				<input type="number" class="form-control" bind:value={price} />
			</div>
		</form>
	</div>
	<div class="col-8">
		{#each filteredItems as item}
			<ItemCategory {item} />
		{/each}
	</div>
</div>
