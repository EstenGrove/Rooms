import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveRoomData, TStatus } from "../types";
import { RootState } from "../../store/store";
import { CurrentRoom, Room } from "./types";
import { fetchLiveRoom, fetchUserRooms } from "./operations";
import { RoomSession } from "../sessions/types";
import { UserRoomsData } from "../../utils/utils_rooms";

export interface RoomsSlice {
	currentRoom: CurrentRoom;
	rooms: Room[];
	status: TStatus;
}

const initialState: RoomsSlice = {
	rooms: [],
	currentRoom: {
		room: null,
		member: null,
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
	extraReducers(builder) {
		builder
			.addCase(fetchLiveRoom.pending, (state: RoomsSlice) => {
				state.status = "PENDING";
			})
			.addCase(
				fetchLiveRoom.fulfilled,
				(state: RoomsSlice, action: PayloadAction<LiveRoomData>) => {
					const { Room, Member, Members, Session } = action.payload;
					state.status = "FULFILLED";
					state.currentRoom = {
						room: Room as Room,
						session: Session as RoomSession,
						member: Member,
						members: Members,
					};
				}
			);
		builder
			.addCase(fetchUserRooms.pending, (state: RoomsSlice) => {
				state.status = "PENDING";
			})
			.addCase(
				fetchUserRooms.fulfilled,
				(state: RoomsSlice, action: PayloadAction<Room[]>) => {
					state.status = "FULFILLED";
					state.rooms = action.payload;
				}
			);
	},
});

export const { setRooms, setCurrentRoom } = roomsSlice.actions;

export const selectCurrentRoom = (state: RootState): CurrentRoom => {
	return state.rooms.currentRoom;
};
export const selectRooms = (state: RootState): Room[] => {
	return state.rooms.rooms;
};

export default roomsSlice.reducer;
