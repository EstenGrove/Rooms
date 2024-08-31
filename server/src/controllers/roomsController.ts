import { Context } from "hono";
import { memberService, roomService, sessionService } from "../services";
import { RoomSvcResult } from "../services/RoomsService";
import { MemberSvcResult } from "../services/MemberService";
import { SessionSvcResult } from "../services/SessionService";

// create a new room
// - member should be an ID not a name, as the member should be created separately
const createRoom = async (ctx: Context) => {
	const body = await ctx.req.json();
	const { roomName, memberName, isAlive = false } = body;

	const newRoom = (await roomService.create(
		roomName as string,
		isAlive as boolean
	)) as RoomSvcResult;

	console.log("Was Created:", newRoom);

	return ctx.json({
		Route: "POST /createRoom",
		Room: {
			RoomName: roomName,
			RoomID: newRoom.room_id,
			RoomCode: newRoom.room_code,
			IsAlive: newRoom.is_alive,
			CreatedDate: newRoom.created_date,
		},
		MemberName: memberName,
		IsAlive: isAlive,
		WasCreated: `Room was created: ${newRoom.room_id}`,
	});
};

const joinRoom = async (ctx: Context) => {
	const roomID = ctx.req.param();
	const { memberID, sessionID } = await ctx.req.json();
	const sessResp = await sessionService.join(sessionID, memberID);
	const memberResp = await memberService.update(memberID, true);

	if (sessResp instanceof Error) {
		return ctx.json({
			Message: "/JOIN Action failed for " + roomID,
			Error: sessResp.message,
		});
	}

	if (memberResp instanceof Error) {
		return ctx.json({
			Message: "/JOIN Action (member-update) failed for " + memberID,
			Error: memberResp.message,
		});
	}

	if (sessResp && memberResp) {
		return ctx.json({
			Message: `Member (${memberID}) has joined room: ${roomID}`,
		});
	}
};

const getRoom = async (ctx: Context) => {
	const id: string = ctx.req.param("roomID");
	const codeOrID: string | number = isNaN(Number(id)) ? id : Number(id);

	const room = (await roomService.get(codeOrID)) as RoomSvcResult;
	const members = (await roomService.getMembers(
		room.room_id
	)) as MemberSvcResult[];
	const sessions = (await sessionService.getByRoomID(
		room.room_id
	)) as SessionSvcResult[];

	return ctx.json({
		Room: {
			RoomName: room.room_name,
			RoomID: room.room_id,
			RoomCode: room.room_code,
			IsAlive: room.is_alive,
			CreatedDate: room.created_date,
		},
		Members: members,
		Sessions: sessions,
	});
};

export { createRoom, joinRoom, getRoom };
