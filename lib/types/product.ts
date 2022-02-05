import { Category } from './category';

export interface Product {
	readonly id: string;
	readonly name: string;
	readonly price: number;
	readonly category: Category;
	readonly description: string;
	readonly qtyInStock: number;
}

export interface ProductMinimal {
	readonly id: string;
	readonly name: string;
	readonly price: number;
}

export interface ProductDB {
	readonly id: string;
	readonly name: string;
	readonly price: number;
	readonly category: number; // reference
	readonly description: string;
	readonly qtyInStock: number;
}
