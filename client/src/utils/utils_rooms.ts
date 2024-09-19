import { JoinValues } from "../components/rooms/types";
import { CurrentMember, RoomMember } from "../features/members/types";
import { CurrentRoom, Room, RoomInfo } from "../features/rooms/types";
import { roomsEndpoints, BASE_URL, currentEnv } from "./utils_env";
import { fetchWithAuth, TResponse } from "./utils_http";
import { TRecord } from "./utils_misc";

export interface CreateRoomData {
	Room: RoomInfo;
	Member: CurrentMember;
}

export interface CreateRoomParams {
	userID: string;
	memberID: number;
	roomName: string;
	memberName: string;
	isAlive: boolean;
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
	RoomsInfo: RoomInfo[];
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
export interface RoomActionParams {
	roomID: number;
	userID: string;
}
const deleteRoom = async (
	params: RoomActionParams
): Promise<TResponse<Room> | unknown> => {
	const url = currentEnv.base + roomsEndpoints.deleteRoom;

	try {
		const response = fetchWithAuth(url, {
			method: "POST",
			body: params,
		});
		return response;
	} catch (error) {
		return error;
	}
};

// UTILS

export type SortBy = keyof Room;

const sortRooms = (by: SortBy, rooms: RoomInfo[]): RoomInfo[] => {
	switch (by) {
		case "lastAliveDate": {
			const sorted = rooms.sort((a, b) => {
				const dateA: Date = new Date(a.lastAliveDate);
				const dateB: Date = new Date(b.lastAliveDate);
				return Number(dateB) - Number(dateA);
			});
			return sorted;
		}
		case "createdDate": {
			const sorted = rooms.sort((a, b) => {
				const dateA: Date = new Date(a.createdDate);
				const dateB: Date = new Date(b.createdDate);
				return Number(dateB) - Number(dateA);
			});
			return sorted;
		}
		default:
			return rooms;
	}
};

interface RoomWithMembers extends Room {
	members: RoomMember[];
}

const mergeMembersIntoRooms = (
	rooms: Room[],
	membersByRoom: TRecord<RoomMember>
): RoomWithMembers[] => {
	const roomsWithMembers = rooms.map((room: Room) => {
		const roomID: string = String(room.roomID);
		if (membersByRoom?.[roomID]) {
			return {
				...room,
				members: membersByRoom?.[roomID],
			};
		}
		return room;
	});

	return roomsWithMembers as RoomWithMembers[];
};

export {
	// REQUESTS
	createRoom,
	deleteRoom,
	getUserRooms,
	joinRoomAsNewGuest,
	// UTILS
	sortRooms,
	mergeMembersIntoRooms,
};
