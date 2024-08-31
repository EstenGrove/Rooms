import { createSlice } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";

export interface CurrentUser {
	username: string;
	password: string;
	displayName: string;
	token: string;
	loginDate: string;
}

export interface CurrentSession {
	token: string;
	lastRefreshed: string;
	isAuthenticated: boolean;
}

export interface AuthSlice {
	currentUser: CurrentUser | null;
	currentSession: CurrentSession | null;
	status: TStatus;
}

const initialState: AuthSlice = {
	currentUser: null,
	currentSession: null,
	status: "IDLE",
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {},
	extraReducers(builder) {
		//
		//
	},
});

export const selectCurrentUser = (state: RootState) =>
	state.auth.currentUser as CurrentUser;

export default authSlice.reducer;
