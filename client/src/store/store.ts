import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import authReducer from "../features/auth/authSlice";
import membersReducer from "../features/members/membersSlice";
import roomsReducer from "../features/rooms/roomsSlice";

const store = configureStore({
	reducer: {
		auth: authReducer,
		rooms: roomsReducer,
		members: membersReducer,
		// sessions: {},
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
