import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";
import { CurrentRoom, Room } from "./types";

export interface RoomsSlice {
	currentRoom: CurrentRoom;
	rooms: Room[];
	status: TStatus;
}

const initialState: RoomsSlice = {
	rooms: [],
	currentRoom: {
		room: null,
		session: null,
		members: [],
	},
	status: "IDLE",
};

const roomsSlice = createSlice({
	name: "rooms",
	initialState: initialState,
	reducers: {
		setRooms(state: RoomsSlice, action: PayloadAction<Room[]>) {
			state.rooms = action.payload;
		},
		setCurrentRoom(state: RoomsSlice, action: PayloadAction<CurrentRoom>) {
			state.currentRoom = action.payload;
		},
	},
});

export const selectCurrentRoom = (state: RootState): CurrentRoom => {
	return state.rooms.currentRoom;
};
export const selectRooms = (state: RootState): Room[] => {
	return state.rooms.rooms;
};

export default roomsSlice.reducer;
