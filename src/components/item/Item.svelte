<script lang="ts">
	import type { ItemDoc } from '$types/item';

	export let item: ItemDoc;

	console.log(item);
</script>

<div class="card mb-3" style="max-width: 540px;">
	<div class="row g-0">
		<div class="col-md-4">
			<img src="..." class="img-fluid rounded-start" alt="..." />
		</div>
		<div class="col-md-8">
			<div class="card-body">
				<h5 class="card-title">{item.doc.name}</h5>
				<h4>{item.doc.price}</h4>
				{#if item.doc.itemsInStock > 5}
					<span class="badge rounded-pill bg-success">In stock</span>
				{:else if item.doc.itemsInStock <= 5 && item.doc.itemsInStock > 1}
					<span class="badge rounded-pill bg-warning">Only {item.doc.itemsInStock} left</span>
				{:else}
					<span class="badge rounded-pill bg-danger">Not in stock</span>
				{/if}
				<br /><a href={`/items/${item.id}`}>Item details</a>
			</div>
		</div>
	</div>
</div>
