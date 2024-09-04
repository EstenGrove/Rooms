import { createSlice } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";
import { CurrentSession, CurrentUser } from "./types";
import { loginUser } from "./operations";
// import { TResponse } from "../../utils/utils_http";

export interface AuthSlice {
	currentUser: CurrentUser | null;
	currentSession: CurrentSession | null;
	status: TStatus;
	error: string | null;
}

export const initialState: AuthSlice = {
	currentUser: null,
	currentSession: null,
	status: "IDLE",
	error: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setCurrentUser(state, action) {
			state.currentUser = action.payload;
		},
		resetCurrentUser(state) {
			state.currentUser = null;
		},
		resetCurrentSession(state) {
			state.currentSession = null;
		},
		resetAuth() {
			return initialState;
		},
	},
	extraReducers(builder) {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "PENDING";
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "FULFILLED";
				state.currentUser = action.payload.data.User as CurrentUser;
				state.currentSession = action.payload.data.Session as CurrentSession;
				state.error = action.payload.error;
			});
	},
});

export const { setCurrentUser, resetCurrentSession, resetAuth } =
	authSlice.actions;

export const selectCurrentUser = (state: RootState) =>
	state.auth.currentUser as CurrentUser;
export const selectCurrentSession = (state: RootState) =>
	state.auth.currentSession as CurrentSession;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
