import { ILoginParams, ISignupParams } from "../features/auth/operations";
import { CurrentSession, CurrentUser } from "../features/auth/types";
import { currentEnv, usersEndpoints } from "./utils_env";
import { fetchWithAuth, TResponse } from "./utils_http";

export interface ILoginResp {
	User: CurrentUser;
	Session: CurrentSession;
}
export interface ISignupResp {
	User: CurrentUser;
	Session: CurrentSession;
}

const login = async (
	userLogin: ILoginParams
): Promise<TResponse<ILoginResp> | unknown> => {
	const url: string = currentEnv.base + usersEndpoints.login;
	try {
		const response = await fetchWithAuth(url, {
			method: "POST",
			body: userLogin,
		});
		return response;
	} catch (error) {
		console.log("error", error);
		return error;
	}
};
const logout = async (
	userID: string
): Promise<TResponse<ILoginResp> | unknown> => {
	let url: string = currentEnv.base + usersEndpoints.logout;
	url += "?" + new URLSearchParams({ userID });
	try {
		const response = await fetchWithAuth(url);
		console.log("response", response);
		return response;
	} catch (error) {
		console.log("error", error);
		return error;
	}
};

const signup = async (
	userSignup: ISignupParams
): Promise<TResponse<ISignupResp> | unknown> => {
	const url: string = currentEnv.base + usersEndpoints.signup;
	try {
		const response = await fetchWithAuth(url, {
			method: "POST",
			body: userSignup,
		});
		console.log("response", response);
		return response;
	} catch (error) {
		console.log("error", error);
		return error;
	}
};

// Normalizes display name & enforces max length
const getUserBadgeName = (name: string, maxLength: number = 10): string => {
	if (!name) return "User";

	if (name.length > maxLength) {
		return name.slice(0, maxLength) + "..";
	} else {
		return name;
	}
};

export { login, logout, signup, getUserBadgeName };
