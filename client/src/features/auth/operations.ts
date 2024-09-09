import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData, UserResp } from "../../utils/utils_users";
import { CurrentUser } from "./types";

export interface ILoginParams {
	username: string;
	password: string;
}

export interface IRefreshLoginParams {
	userID: string;
	sessionID: number;
}

const fetchUser = createAsyncThunk("auth/fetchUser", async (userID: string) => {
	const response = (await fetchUserData(userID)) as UserResp;
	const { Data } = response;
	const userData = Data?.User as CurrentUser;

	return userData as CurrentUser;
});

export type ISignupParams = ILoginParams;

export { fetchUser };
