export interface Review {
	readonly id: string;
	readonly createdAt: string; // timestamp
	readonly title: string;
	readonly description: string;
	readonly rating: number;
	readonly product: string; // reference
	readonly author: {
		id: string;
		name: string;
	};
}

export interface ReviewMinimal {
	readonly title: string;
	readonly description: string;
	readonly rating: number;
	readonly product: string; // reference
	readonly author: {
		id: string;
		name: string;
	};
}
