import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LiveRoomData, TStatus } from "../types";
import { RootState } from "../../store/store";
import { CurrentRoom, Room, RoomInfo } from "./types";
import { createUserRoom, fetchLiveRoom, fetchUserRooms } from "./operations";
import { RoomSession } from "../sessions/types";
import { CreateRoomData, sortRooms } from "../../utils/utils_rooms";

export interface RoomsSlice {
	currentRoom: CurrentRoom;
	rooms: RoomInfo[];
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
		setRooms(state: RoomsSlice, action: PayloadAction<RoomInfo[]>) {
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
					const { Room, Members, Session } = action.payload;
					state.status = "FULFILLED";
					state.currentRoom = {
						room: Room as Room,
						session: Session as RoomSession,
						// member: Member,
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
				(state: RoomsSlice, action: PayloadAction<RoomInfo[]>) => {
					const sorted: RoomInfo[] = sortRooms(
						"createdDate",
						action.payload || []
					);
					state.status = "FULFILLED";
					// merge data
					state.rooms = sorted;
				}
			);
		builder
			.addCase(createUserRoom.pending, (state: RoomsSlice) => {
				state.status = "PENDING";
			})
			.addCase(
				createUserRoom.fulfilled,
				(state: RoomsSlice, action: PayloadAction<CreateRoomData>) => {
					const { Room } = action.payload;
					state.status = "FULFILLED";
					state.rooms = [Room, ...state.rooms];
					state.currentRoom = {
						room: Room,
						members: [],
						session: null,
					};
				}
			);
	},
});

export const { setRooms, setCurrentRoom } = roomsSlice.actions;

export const selectCurrentRoom = (state: RootState): CurrentRoom => {
	return state.rooms.currentRoom;
};
export const selectRooms = (state: RootState): RoomInfo[] => {
	return state.rooms.rooms;
};
export const selectCurrentRoomInfo = (state: RootState): RoomInfo => {
	return state.rooms.currentRoom.room as RoomInfo;
};

export default roomsSlice.reducer;
