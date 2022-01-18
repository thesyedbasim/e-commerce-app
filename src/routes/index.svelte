<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';

	import { getManyDocs } from '$lib/firebase';
	import type { Category } from '$lib/types/category';

	export const load: Load = async () => {
		const getCategoryData = async () => {
			const { data } = await getManyDocs<Category>({ path: 'categories' });

			return data;
		};

		const categories = await getCategoryData();

		console.log('categories', categories);

		return { props: { categories } };
	};
</script>

<script lang="ts">
	export let categories;
</script>

<h1>Welcome to amazon clone</h1>
<div class="row row-cols-1 row-cols-md-2 g-4">
	{#each categories as category}
		<div class="col">
			<div class="card">
				<img src="..." class="card-img-top" alt="..." />
				<div class="card-body">
					<h5 class="card-title">{category.doc.name}</h5>
					<p class="card-text">
						{category.doc.description}
					</p>
					<a class="btn btn-primary" href={`categories/${category.id}`}>View category</a>
				</div>
			</div>
		</div>
	{/each}
</div>
