import { JoinValues, RoomValues } from "../components/rooms/types";
import { roomsEndpoints, BASE_URL, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_http";

const createRoom = async (token: string, roomData: RoomValues) => {
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

const joinRoomAsNewGuest = async (joinValues: JoinValues) => {
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

export { createRoom, joinRoomAsNewGuest };
