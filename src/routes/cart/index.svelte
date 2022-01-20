<!-- <script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { IDoc } from '$lib/types/firebase';
	import type { Item } from '$lib/types/item';
	import { getItemsInCart } from '$lib/store/cartStore';

	export const load: Load = async () => {
		let cartItems: IDoc<Item>[] = [];

		getItemsInCart((items) => {
			cartItems.push(...items);
		});

		return {
			props: {
				cartItems
			}
		};
	};
</script> -->
<script lang="ts">
	import type { ItemCart } from '$types/item';
	import {
		subscribeItemsInCart,
		removeItemFromCart,
		subscribeTotalPriceInCart
	} from '$store/cartStore';

	let cartItems: ItemCart[] = [];
	subscribeItemsInCart((items) => {
		cartItems = items;
	});

	let totalPriceInCart = 0;
	subscribeTotalPriceInCart((totalPrice) => {
		totalPriceInCart = totalPrice;
	});
</script>

<h2>total price: {totalPriceInCart}</h2>
{#each cartItems as item (item.id)}
	<div class="card mb-3" style="max-width: 540px;">
		<div class="row g-0">
			<div class="col-md-4">
				<img src="..." class="img-fluid rounded-start" alt="..." />
			</div>
			<div class="col-md-8">
				<div class="card-body">
					<a href={`/items/${item.id}`}><h5 class="card-title">{item.doc.name}</h5></a>
					<p class="card-text">
						{item.doc.price}
					</p>
					<p class="card-text">
						quantity: {item.quantity}
					</p>
					<button class="btn btn-danger" on:click={() => removeItemFromCart(item.id)}
						>Remove from cart</button
					>
				</div>
			</div>
		</div>
	</div>
{/each}
