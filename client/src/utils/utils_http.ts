import { TStatus } from "../features/types";
import { currentEnv } from "./utils_env";

export type TResponseStatus = "SUCCESS" | "FAIL";
export type TResponse<T> = {
	Status: TStatus;
	Data: T | null;
	Message: string;
	ErrorMsg: string | null;
	StackTrace: string | null;
};

export interface IRequestOpts {
	method?: "GET" | "POST" | "DELETE" | "PUT";
	headers?: {
		[key: string]: unknown;
		Authorization: string;
	};
	body?: unknown;
}

const defaultGet: IRequestOpts = {
	method: "GET",
	headers: {
		Authorization: btoa(currentEnv.user + ":" + currentEnv.password) as string,
	},
};

const fetchWithAuth = async (
	url: URL | string,
	options: IRequestOpts = defaultGet
) => {
	const {
		method = "GET",
		headers = { ...defaultGet.headers },
		body,
	} = options as IRequestOpts;
	try {
		const request = await fetch(url, {
			method,
			headers: {
				...headers,
				Authorization: btoa(currentEnv.user + ":" + currentEnv.password),
			},
			body: JSON.stringify(body),
		});
		const response = await request.json();
		console.log("response", response);
		return response;
	} catch (error: unknown) {
		return error;
	}
};

class ApiFetch {
	#apiUser: string;
	#apiPassword: string;

	constructor(
		apiUser: string = currentEnv.user,
		apiPassword: string = currentEnv.password
	) {
		this.#apiUser = apiUser;
		this.#apiPassword = apiPassword;
	}
	async #fetchWithAuth<T>(
		url: URL | string,
		options?: IRequestOpts
	): Promise<TResponse<T> | unknown> {
		const { method = "GET", headers = {}, body } = options as IRequestOpts;
		try {
			const request = await fetch(url, {
				method,
				headers: {
					...headers,
					Authorization: btoa(this.#apiUser + ":" + this.#apiPassword),
				},
				body: JSON.stringify(body),
			});
			const response = await request.json();
			console.log("response", response);
			return response;
		} catch (error: unknown) {
			return error;
		}
	}

	async get<T>(
		url: URL | string,
		params?: Record<string, string>
	): Promise<TResponse<T> | unknown> {
		const newParams: URLSearchParams = new URLSearchParams(params);
		const newUrl: string = `${url}?${newParams}`;

		try {
			const response = await this.#fetchWithAuth(newUrl);
			return response;
		} catch (error: unknown) {
			return error;
		}
	}
	async post<T>(
		url: URL | string,
		body: object
	): Promise<TResponse<T> | unknown> {
		try {
			const response = await this.#fetchWithAuth(url, {
				method: "POST",
				body: body,
			});
			return response;
		} catch (error: unknown) {
			return error;
		}
	}
}

const apiService = new ApiFetch(currentEnv.user, currentEnv.password);

export { fetchWithAuth, apiService };
