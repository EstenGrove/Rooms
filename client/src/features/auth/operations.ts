import { createAsyncThunk } from "@reduxjs/toolkit";
import { login, signup } from "../../utils/utils_users";

export interface ILoginParams {
	username: string;
	password: string;
}

export type ISignupParams = ILoginParams;

const loginUser = createAsyncThunk(
	"auth/loginUser",
	async (params: ILoginParams) => {
		const loginResp = await login(params);
		const { Data } = loginResp;
		console.log("loginResp", loginResp);
		console.log("Data", Data);
		return Data;
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
