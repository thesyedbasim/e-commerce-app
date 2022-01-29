import { ProductMinimal } from './product';

export interface Order {
	readonly id: number;
	paidAt: Date;
	products: ProductMinimal[];
	orderAmount: number;
	userId: string;
}

export interface OrderDB {
	readonly id: number;
	paid_at: Date;
	order_amount: number;
	user_id: string;
}

export interface OrderItem {
	readonly id: number;
	orderId: number;
	productId: number;
}

export interface OrderItemDB {
	readonly id: number;
	order_id: number;
	product_id: number;
}
