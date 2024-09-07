import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, signup } from "../../utils/utils_users";
import { TResponse } from "../../utils/utils_http";
import { CurrentSession, CurrentUser } from "./types";

export interface ILoginParams {
	username: string;
	password: string;
}

export type ISignupParams = ILoginParams;

const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (params: ILoginParams) => {
		const loginResp = (await login(params)) as TResponse<{
			User: object;
			Session: object;
		}>;
		const data = loginResp.Data as {
			User: CurrentUser;
			Session: CurrentSession;
		};
		const error = loginResp.Error as string;
		console.log("loginResp", loginResp);
		return { error: error, data: data };
	}
);
const signupUser = createAsyncThunk(
	"auth/signupUser",
	async (params: ISignupParams) => {
		const signupResp = await signup(params);
		const { Data } = signupResp;
		console.log("signupResp", signupResp);
		console.log("Data", Data);
		return Data;
	}
);

export { loginUser, signupUser };
