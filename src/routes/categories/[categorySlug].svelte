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
	export let items;
</script>

{#each items as item}
	<div class="card mb-3" style="max-width: 540px;">
		<div class="row g-0">
			<div class="col-md-4">
				<img src="..." class="img-fluid rounded-start" alt="..." />
			</div>
			<div class="col-md-8">
				<div class="card-body">
					<h5 class="card-title">{item.doc.name}</h5>
					<h4>${item.doc.price}</h4>
					<a href={`/items/${item.id}`}>Item details</a>
				</div>
			</div>
		</div>
	</div>
{/each}
