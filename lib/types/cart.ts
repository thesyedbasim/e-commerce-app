import { ProductMinimal } from './product';

export interface Cart {
	readonly id: number;
	readonly quantity: number;
	readonly addedAt?: string; // timestamp
	readonly product: ProductMinimal;
	readonly userUid?: string; // reference
}

export interface CartDB {
	readonly id: number;
	readonly quantity: number;
	readonly addedAt: string; // timestamp
	readonly product: number; // reference
	readonly user: string; // reference
}
