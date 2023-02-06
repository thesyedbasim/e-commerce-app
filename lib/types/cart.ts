import type { ProductMinimal } from '$lib/types/product';

export interface SelectedVariant {
	readonly name: string;
	readonly option: { name: string; meta?: { [key: string]: any } };
}

export interface Cart {
	readonly id: number;
	readonly quantity: number;
	readonly addedAt?: string; // timestamp
	readonly product: ProductMinimal;
	readonly userUid?: string; // reference
	readonly variants?: SelectedVariant[];
}
