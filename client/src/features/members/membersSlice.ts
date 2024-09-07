import { createSlice } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { RootState } from "../../store/store";
import { RoomMember } from "./types";

export interface MembersSlice {
	roomMembers: RoomMember[];
	currentMember: RoomMember | null;
	status: TStatus;
}

const initialState: MembersSlice = {
	roomMembers: [],
	currentMember: null,
	status: "IDLE",
};

const membersSlice = createSlice({
	name: "members",
	initialState: initialState,
	reducers: {
		setCurrentMember(state, action) {
			state.currentMember = action.payload;
		},
		setRoomMembers(state, action) {
			state.roomMembers = action.payload;
		},
	},
});

export const { setCurrentMember, setRoomMembers } = membersSlice.actions;

export const selectRoomMembers = (state: RootState): RoomMember[] => {
	return state.members.roomMembers;
};
export const selectCurrentMember = (state: RootState): RoomMember => {
	return state.members.currentMember as RoomMember;
};

export default membersSlice.reducer;
