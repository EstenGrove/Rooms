import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "../features/auth/authSlice";
import roomsReducer from "../features/rooms/roomsSlice";
import membersReducer from "../features/members/membersSlice";
import sessionsReducer from "../features/sessions/sessionsSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		rooms: roomsReducer,
		members: membersReducer,
		sessions: sessionsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
