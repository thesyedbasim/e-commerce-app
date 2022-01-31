export interface User {
	uid: string;
	name: string;
	email: string;
	createdAt: Date;
	stripeCustomer: string;
}
