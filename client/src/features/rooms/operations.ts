import { createAsyncThunk } from "@reduxjs/toolkit";
import { currentEnv, roomsEndpoints } from "../../utils/utils_env";
import { fetchWithAuth, TResponse } from "../../utils/utils_http";
import { LiveRoomData } from "../types";
import {
	createRoom,
	CreateRoomData,
	CreateRoomParams,
	getUserRooms,
	UserRoomsResp,
} from "../../utils/utils_rooms";
import { RoomInfo } from "./types";

export interface LiveRoomParams {
	roomCode: string;
	memberID: number;
}

export type LiveRoomResp = TResponse<LiveRoomData>;

const fetchLiveRoomInfo = async (
	roomCode: string,
	memberID: number
): Promise<LiveRoomResp | unknown> => {
	let url = currentEnv.base + roomsEndpoints.getLiveRoom;
	url += "?" + new URLSearchParams({ roomCode, memberID: memberID.toString() });

	try {
		const response = await fetchWithAuth(url);
		return response as LiveRoomResp;
	} catch (error) {
		return error;
	}
};

const fetchLiveRoom = createAsyncThunk(
	"rooms/fetchLiveRoom",
	async (params: LiveRoomParams) => {
		const { roomCode, memberID } = params;
		const response = (await fetchLiveRoomInfo(
			roomCode,
			memberID
		)) as LiveRoomResp;
		const data = response?.Data;

		return data as LiveRoomData;
	}
);

const fetchUserRooms = createAsyncThunk(
	"rooms/fetchUserRooms",
	async (userID: string) => {
		const response = (await getUserRooms(userID)) as UserRoomsResp;
		const { Data } = response;
		const userRooms = Data?.RoomsInfo ?? [];

		return userRooms as RoomInfo[];
	}
);

const createUserRoom = createAsyncThunk(
	"rooms/createUserRoom",
	async (params: CreateRoomParams) => {
		const response = (await createRoom(params)) as TResponse<CreateRoomData>;
		const data = response.Data as CreateRoomData;

		return data;
	}
);

export { fetchLiveRoom, fetchLiveRoomInfo, fetchUserRooms, createUserRoom };
