export interface Product {
	readonly id: number;
	name: string;
	price: number;
	about: string;
	qty_in_stock: number;
}

export interface ProductMinimal {
	readonly id: number;
	name: string;
	price: number;
}
