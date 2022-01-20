<script lang="ts">
	import type { ItemDoc } from '$types/item';

	export let item: ItemDoc;
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
				<a href={`/items/${item.id}`}>Item details</a>
			</div>
		</div>
	</div>
</div>
