import { Category } from './category';

export interface Product {
	readonly id: number;
	readonly name: string;
	readonly price: number;
	readonly category: Category;
	readonly description: string;
	readonly qtyInStock: number;
	readonly stripeProduct: string; // stripe product id
}

export interface ProductMinimal {
	readonly id: number;
	readonly name: string;
	readonly price: number;
}

export interface ProductDB {
	readonly id: number;
	readonly name: string;
	readonly price: number;
	readonly category: number; // reference
	readonly description: string;
	readonly qtyInStock: number;
	readonly stripeProduct: string; // stripe product id
}
