import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";

export type SessionStatus = "ACTIVE" | "INACTIVE" | "ENDING" | "STARTING";
export interface CurrentSession {
	roomCode: string;
	roomName: string;
	roomID: number;
	sessionID: number;
	wssUrl: string;
	sessionStatus: SessionStatus;
}

export interface SessionSlice {
	currentSession: CurrentSession | null;
	status: TStatus;
}

const initialState: SessionSlice = {
	currentSession: null,
	status: "IDLE",
};

const sessionsSlice = createSlice({
	name: "sessions",
	initialState: initialState,
	reducers: {
		setSession(state: SessionSlice, action: PayloadAction<CurrentSession>) {
			state.currentSession = action.payload;
		},
	},
});

export const selectCurrentSession = (state: RootState) => {
	return state.sessions.currentSession;
};

export default sessionsSlice.reducer;
