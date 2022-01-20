import { derived, writable } from 'svelte/store';
import type { Item, ItemCart } from '$types/item';
import { setOneDoc } from '$lib/firebase';

const itemsInCart = writable<ItemCart[]>([]);
export const addItemToCart = async (item: ItemCart): Promise<void> => {
	const dbAddItemToCart = async (item: ItemCart) => {
		const itemToSet: { itemId: string; quantity: number; itemDetails: Item } = {
			itemId: item.id,
			quantity: item.quantity,
			itemDetails: { ...item.doc }
		};

		return await setOneDoc({
			path: 'cart',
			data: item,
			options: { shouldMerge: true }
		});
	};

	const storeAddItemToCart = (): ItemCart | undefined => {
		let itemWhichExists: ItemCart;

		itemsInCart.update((items) => {
			const itemIndex = items.findIndex((itemSearch) => itemSearch.id === item.id);
			itemWhichExists = items[itemIndex];

			if (itemIndex >= 0) {
				itemWhichExists.quantity += 1;

				return items;
			}

			return [...items, item];
		});

		return itemWhichExists;
	};

	const itemWhichExists = storeAddItemToCart();
	const { error } = await dbAddItemToCart(itemWhichExists || item);
};
export const subscribeItemsInCart = itemsInCart.subscribe;
export const removeItemFromCart = (itemId: string): void => {
	itemsInCart.update((items) => items.filter((item) => item.id !== itemId));
};

const numOfItemsInCart = derived(itemsInCart, (allItemsInCart) =>
	allItemsInCart.reduce((total, currentItem) => total + currentItem.quantity, 0)
);
export const subscribeNumOfItemsInCart = numOfItemsInCart.subscribe;

const totalPriceInCart = derived(itemsInCart, (allItemsInCart) =>
	allItemsInCart.reduce(
		(total, currentItem) => total + currentItem.doc.price * currentItem.quantity,
		0
	)
);
export const subscribeTotalPriceInCart = totalPriceInCart.subscribe;
