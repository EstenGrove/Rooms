import {
	MemberClient,
	MemberDB,
	memberNormalizer,
} from "../data/MemberNormalizer";
import { RoomDB } from "../data/RoomNormalizer";
import { TRecord } from "../utils_data";

interface RoomWithMembers extends RoomDB {
	members: MemberClient[];
}

const mergeMembersIntoRooms = (
	rooms: RoomDB[],
	membersByRoom: TRecord<MemberDB>
): RoomWithMembers[] => {
	const roomsWithMembers = rooms.map((room: RoomDB) => {
		const roomID: string = String(room.room_id);
		const rawMembers = membersByRoom?.[roomID] ?? [];
		const members = memberNormalizer.toClient(rawMembers);
		return {
			...room,
			members: members,
		};
	});

	return roomsWithMembers as RoomWithMembers[];
};

export { mergeMembersIntoRooms };
