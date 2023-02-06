import type { Category } from '$lib/types/category';
import type { Seller } from '$lib/types/seller';

export interface ProductVariant {
	readonly name: string;
	readonly options: {
		readonly name: string;
		readonly meta?: { [key: string]: any };
	}[];
	readonly optionsSize: 'small' | 'medium' | 'large';
}

export interface Product {
	readonly id: string;
	readonly name: string;
	readonly price: number;
	readonly description: string;
	readonly seller: Seller;
	readonly qtyInStock: number;
	readonly category: Category;
	readonly prevPrice: number;
	readonly variants: ProductVariant[];
	readonly details: any[];
}

// for searches and product cards where all product information is not displayed
export interface ProductMinimal {
	readonly id: string;
	readonly name: string;
	readonly price: number;
	readonly seller: Seller;
}
