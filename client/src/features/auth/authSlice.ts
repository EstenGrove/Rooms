import { createSlice } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";
import { CurrentSession, CurrentUser } from "./types";
import { loginUser } from "./operations";

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
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = "PENDING";
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = "FULFILLED";
				state.currentUser = action.payload;
			});
	},
});

export const selectCurrentUser = (state: RootState) =>
	state.auth.currentUser as CurrentUser;
export const selectCurrentSession = (state: RootState) =>
	state.auth.currentSession as CurrentSession;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export default authSlice.reducer;
