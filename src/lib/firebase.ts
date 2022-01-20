import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	getDocs,
	collection,
	query,
	where,
	getDoc,
	doc,
	addDoc,
	setDoc
} from 'firebase/firestore';
import type { QuerySnapshot, DocumentData, FieldPath, WhereFilterOp } from 'firebase/firestore';

import type { ReturnManyDocs, ReturnNoDoc, ReturnOneDoc } from '$lib/types/firebase';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_PUBLIC_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export const getManyDocs = async <T>({
	path,
	condition
}: {
	path: string;
	condition?: [condition: string | FieldPath, opStr: WhereFilterOp, value: unknown];
}): Promise<ReturnManyDocs<T>> => {
	const returnObj: ReturnManyDocs<T> = { error: null, data: null };

	try {
		let data: QuerySnapshot<DocumentData>;

		if (condition && condition.length > 0) {
			data = await getDocs(query(collection(firestore, path), where(...condition)));
		}

		data = await getDocs(collection(firestore, path));

		returnObj.data = data.docs.map((queryDocSnap) => ({
			id: queryDocSnap.id,
			doc: queryDocSnap.data() as T
		}));
	} catch (err) {
		returnObj.error = { message: err.message };
	}

	return returnObj;
};

export const getOneDoc = async <T>({ path }: { path: string }): Promise<ReturnOneDoc<T>> => {
	const returnObj: ReturnOneDoc<T> = { error: null, data: null };

	try {
		const data = await getDoc(doc(firestore, path));

		returnObj.data = { id: data.id, doc: data.data() as T };
	} catch (err) {
		returnObj.error.message = err.message;
	}

	return returnObj;
};

export const addOneDoc = async <T>({
	path,
	data
}: {
	id?: string;
	path: string;
	data: T;
}): Promise<ReturnNoDoc> => {
	const returnObject: ReturnNoDoc = { error: null };

	try {
		await addDoc(collection(firestore, path), data);
	} catch (err) {
		returnObject.error.message = err.message;
	}

	return returnObject;
};

export const setOneDoc = async <T>({
	id,
	path,
	data,
	options
}: {
	id?: string;
	path: string;
	data: T;
	options?: {
		shouldMerge?: boolean;
	};
}): Promise<ReturnNoDoc> => {
	const returnObject: ReturnNoDoc = { error: null };

	try {
		if (options) {
			await setDoc(doc(firestore, path, id), data, { merge: !!options.shouldMerge });
		} else {
			await setDoc(doc(firestore, path, id), data);
		}
	} catch (err) {
		returnObject.error.message = err.message;
	}

	return returnObject;
};
