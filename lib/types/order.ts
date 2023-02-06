import type { Cart } from '$lib/types/cart';
import type { Product } from '$lib/types/product';

export type OrderStatus =
	| 'PAYMENT_PENDING'
	| 'TRACKED'
	| 'DISPATCHED'
	| 'DELIVERED';

export type OrderMethod = 'CART';

export interface Order {
	readonly id: string;
	readonly paidAt: string; // timestamp
	readonly user: string; // reference
	readonly amount: number;
	readonly products: {
		id: Product['id'];
		name: Product['name'];
		price: Product['price'];
		quantity: Cart['quantity'];
		variantsSelected: Cart['variants'];
	}[];
	readonly status: OrderStatus;
	readonly method: OrderMethod;
}
