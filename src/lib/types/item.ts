import type { IDoc } from './firebase';

export interface Item {
	name: string;
	price: number;
	category: any;
	itemsInStock: number;
}

export type ItemDoc = IDoc<Item>;

export type ItemCart = IDoc<Item> & { quantity: number };
