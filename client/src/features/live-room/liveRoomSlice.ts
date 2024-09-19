import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";
import { RoomInfo } from "../rooms/types";
import { PointsCard, RoomTickets, Ticket } from "./types";

export interface LiveRoomSlice {
	status: TStatus;
	info: RoomInfo | null;
	cardOptions: {
		cards: PointsCard[];
		// other customizations can go here later
	};
	tickets: RoomTickets;
}

const initialState: LiveRoomSlice = {
	status: "IDLE",
	info: null,
	cardOptions: {
		cards: [],
	},
	tickets: {
		active: null,
		waiting: [],
		reviewed: [],
	},
};

const liveRoomSlice = createSlice({
	name: "liveRoom",
	initialState: initialState,
	reducers: {
		setActiveTicket(state: LiveRoomSlice, action: PayloadAction<Ticket>) {
			state.tickets.active = action.payload;
		},
	},
});

export const { setActiveTicket } = liveRoomSlice.actions;

export const selectLiveRoom = (state: RootState): LiveRoomSlice => {
	return state.liveRoom;
};
export const selectLiveRoomTickets = (state: RootState): RoomTickets => {
	return state.liveRoom.tickets;
};
export const selectLiveRoomCards = (state: RootState): PointsCard[] => {
	return state.liveRoom.cardOptions.cards;
};
export const selectLiveLoadingStatus = (state: RootState): TStatus => {
	return state.liveRoom.status;
};

export default liveRoomSlice.reducer;
