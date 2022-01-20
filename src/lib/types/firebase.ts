export interface IError {
	message: string;
}

export interface IDoc<T> {
	id: string;
	doc: T;
}

export interface ReturnManyDocs<T> {
	error?: IError;
	data?: IDoc<T>[];
}

export interface ReturnOneDoc<T> {
	error?: IError;
	data?: IDoc<T>;
}

export interface ReturnNoDoc {
	error?: IError;
}
