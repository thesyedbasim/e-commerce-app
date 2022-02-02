export interface User {
	readonly uid: string; // same id as supabase user
	readonly name: string;
	readonly email: string;
	readonly createdAt: Date;
	readonly stripeCustomer: string; // stripe custome id
}

export interface UserDB {
	readonly uid: string; // same id as supabase user
	readonly name: string;
	readonly email: string;
	readonly createdAt: Date;
	readonly stripeCustomer: string; // stripe custome id
}
