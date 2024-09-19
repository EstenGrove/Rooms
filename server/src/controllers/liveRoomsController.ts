import { Context } from "hono";
import { memberService, roomService, sessionService } from "../services";
import { RoomDB } from "../utils/data/RoomNormalizer";
import { MemberDB } from "../utils/data/MemberNormalizer";

const getLiveRoomData = async (ctx: Context) => {
	const queryData = ctx.req.query();
	const roomCode: string = queryData.roomCode;
	const memberID: number = Number(queryData.memberID);

	// Data to Return:
	// - room
	// - members
	// - point cards
	// - tickets
	// Actions:
	// - start room, if not started already
	// - member joins room

	const roomRecord = (await roomService.getByCode(roomCode)) as RoomDB;
	const memberRecords = (await roomService.getMembers(
		roomRecord.room_id
	)) as MemberDB[];
};
