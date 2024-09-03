import { ILoginParams, ISignupParams } from "../features/auth/operations";
import { currentEnv, usersEndpoints } from "./utils_env";
import { fetchWithAuth } from "./utils_http";

const login = async (userLogin: ILoginParams) => {
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
const signup = async (userSignup: ISignupParams) => {
	const url: string = currentEnv.base + usersEndpoints.login;
	try {
		const response = await fetchWithAuth(url, {
			method: "POST",
			body: userSignup,
		});
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

export { login, signup, getUserBadgeName };
