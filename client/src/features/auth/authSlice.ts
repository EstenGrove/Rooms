import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";
import { CurrentSession, CurrentUser } from "./types";
import { fetchUser } from "./operations";

export interface AuthSlice {
	currentUser: CurrentUser | null;
	currentSession: CurrentSession | null;
	status: TStatus;
}

export const initialState: AuthSlice = {
	currentUser: null,
	currentSession: null,
	status: "IDLE",
};

const authSlice = createSlice({
	name: "auth",
	initialState: initialState,
	reducers: {
		setAuth(state, action) {
			state.currentUser = action.payload.user;
			state.currentSession = action.payload.session;
		},
		setCurrentUser(state, action) {
			state.currentUser = action.payload;
		},
		// refreshUserAuth(state, action) {
		// 	// ##TODO
		// },
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
			.addCase(fetchUser.pending, (state: AuthSlice) => {
				state.status = "PENDING";
			})
			.addCase(
				fetchUser.fulfilled,
				(state: AuthSlice, action: PayloadAction<CurrentUser>) => {
					state.status = "FULFILLED";
					state.currentUser = action.payload;
				}
			);
	},
});

export const { setCurrentUser, setAuth, resetCurrentSession, resetAuth } =
	authSlice.actions;

export const selectCurrentUser = (state: RootState) =>
	state.auth.currentUser as CurrentUser;
export const selectCurrentSession = (state: RootState) =>
	state.auth.currentSession as CurrentSession;
export const selectAuthStatus = (state: RootState) => state.auth.status;

export const selectIsLoadingState = (state: RootState) => {
	const authLoading: boolean = state.auth.status === "PENDING";
	const roomsLoading: boolean = state.rooms.status === "PENDING";

	return authLoading || roomsLoading;
};

export default authSlice.reducer;
