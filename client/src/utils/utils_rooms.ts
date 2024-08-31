import { RoomValues } from "../components/rooms/types";
import { API_ENDPOINTS, BASE_URL, currentEnv } from "./utils_env";

const createRoom = async (token: string, roomData: RoomValues) => {
	const url = BASE_URL + API_ENDPOINTS.rooms.create;

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

export { createRoom };
