import { derived, writable } from 'svelte/store';
import type { IDoc } from '$lib/types/firebase';
import type { Item } from '$lib/types/item';

const itemsInCart = writable<IDoc<Item>[]>([]);
export const addItemToCart = (item: IDoc<Item>): void => {
	itemsInCart.update((items) => [...items, item]);
};
export const subscribeItemsInCart = itemsInCart.subscribe;
export const removeItemFromCart = (itemId: string): void => {
	itemsInCart.update((items) => items.filter((item) => item.id !== itemId));
};

const numOfItemsInCart = derived(itemsInCart, (allItemsInCart) => allItemsInCart.length);
export const subscribeNumOfItemsInCart = numOfItemsInCart.subscribe;

// const totalPriceOfItemsInCart = derived(itemsInCart, (allItemsInCart) => allItemsInCart.reduce((prevItemIndex, itemIndex, items) => items[prevItemIndex], 0))
