import { User } from '@supabase/supabase-js';
import { Product, ProductMinimal } from './product';

export interface Wishlist {
	id: string;
	product: ProductMinimal;
	user: User['id'];
}

export interface WishlistRaw {
	id: string;
	product: Product['id'];
	user: User['id'];
}
