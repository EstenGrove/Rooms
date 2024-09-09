import { JoinValues, RoomValues } from "../components/rooms/types";
import { RoomMember } from "../features/members/types";
import { CurrentRoom, Room } from "../features/rooms/types";
import { roomsEndpoints, BASE_URL, currentEnv } from "./utils_env";
import { fetchWithAuth, TResponse } from "./utils_http";

export interface CreateRoomData {
	roomID: number;
	roomName: string;
	memberName: string;
	memberID: number;
}
export type CreateRoomResponse = TResponse<CreateRoomData>;

const createRoom = async (
	token: string,
	roomData: RoomValues
): Promise<CreateRoomResponse | unknown> => {
	const url = BASE_URL + roomsEndpoints.create;

	try {
		const request = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: btoa(currentEnv.user + ":" + currentEnv.password),
				SecurityToken: token,
			},
			body: JSON.stringify(roomData),
		});
		const response = await request.json();
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
