import { currentEnv, liveEndpoints } from "./utils_env";
import { fetchWithAuth } from "./utils_http";

const fetchLiveRoomData = async (roomID: number, memberID: number) => {
	let url = currentEnv.base + liveEndpoints.getInfo;
	url +=
		"?" +
		new URLSearchParams({ roomID: String(roomID), memberID: String(memberID) });

	try {
		const response = await fetchWithAuth(url);
		return response;
	} catch (error) {
		return error;
	}
};

const fetchLiveRoomCards = async (roomID: number) => {
	let url = currentEnv.base + liveEndpoints.getCards;
	url += "?" + new URLSearchParams({ roomID: String(roomID) });

	try {
		const response = await fetchWithAuth(url);
		return response;
	} catch (error) {
		return error;
	}
};

export { fetchLiveRoomData };
