import { ProductMinimal } from './product';

export interface Cart {
	readonly id: number;
	quantity: number;
	product: ProductMinimal;
}

export interface CartDB {
	readonly id: number;
	added_at: Date;
	product_id: number;
	quantity: number;
	user_id: string;
}
