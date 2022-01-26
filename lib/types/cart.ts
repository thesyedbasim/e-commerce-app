import { ProductMinimal } from './product';

export interface Cart {
	readonly id?: number;
	quantity: number;
	product: ProductMinimal;
}
