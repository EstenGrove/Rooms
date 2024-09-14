import { JoinValues, RoomValues } from "../components/rooms/types";
import { CurrentMember, RoomMember } from "../features/members/types";
import { CurrentRoom, Room } from "../features/rooms/types";
import { roomsEndpoints, BASE_URL, currentEnv } from "./utils_env";
import { fetchWithAuth, TResponse } from "./utils_http";

export interface CreateRoomData2 {
	roomID: number;
	roomName: string;
	memberName: string;
	memberID: number;
}
export interface CreateRoomData {
	Room: Room;
	Member: CurrentMember;
}

export interface CreateRoomParams extends RoomValues {
	userID: string;
}

const createRoom = async (
	roomData: CreateRoomParams
): Promise<TResponse<CreateRoomData> | unknown> => {
	const url = BASE_URL + roomsEndpoints.create;

	try {
		const response = await fetchWithAuth(url, {
			method: "POST",
			body: roomData,
		});
		console.log("response", response);
		return response;
	} catch (error) {
		return error;
	}
};

export interface JoinRoomData {
	Member: RoomMember;
	Room: CurrentRoom | Room;
}
export type JoinRoomResponse = TResponse<JoinRoomData>;

const joinRoomAsNewGuest = async (
	joinValues: JoinValues
): Promise<JoinRoomResponse | unknown> => {
	let url = currentEnv.base + roomsEndpoints.joinAsNewGuest;
	url += joinValues.roomCode;

	try {
		const response = await fetchWithAuth(url, {
			method: "POST",
			body: joinValues,
		});
		console.log("response", response);
		return response;
	} catch (error) {
		console.log("error", error);
		return error;
	}
};

export interface UserRoomsData {
	Rooms: Room[];
}
export type UserRoomsResp = TResponse<UserRoomsData>;

const getUserRooms = async (
	userID: string
): Promise<UserRoomsResp | unknown> => {
	let url = currentEnv.base + roomsEndpoints.getRooms;
	url += "?" + new URLSearchParams({ userID });

	try {
		const response = await fetchWithAuth(url);
		return response;
	} catch (error) {
		return error;
	}
};

export { createRoom, joinRoomAsNewGuest, getUserRooms };
