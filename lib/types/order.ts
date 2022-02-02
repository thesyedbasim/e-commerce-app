import { ProductMinimal } from './product';

export type OrderStatus =
	| 'PAYMENT_PENDING'
	| 'TRACKED'
	| 'DISPATCHED'
	| 'DELIVERED';

export type OrderMethod = 'CART';

export interface Order {
	readonly id: number;
	readonly products: ProductMinimal[];
	readonly status: OrderStatus;
	readonly paidAt: string; // timestamp
	readonly amount: number;
	readonly userUid: string; // reference
	readonly method: OrderMethod;
}

export interface OrderDB {
	readonly id: number;
	readonly products: ProductMinimal[];
	readonly status: OrderStatus;
	readonly paidAt: string; // timestamp
	readonly amount: number;
	readonly user: string; // reference
	readonly method: OrderMethod;
}
