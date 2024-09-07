import { Context } from "hono";
import { memberService, roomService, sessionService } from "../services";
import { RoomSvcResult } from "../services/RoomsService";
import { MemberSvcResult } from "../services/MemberService";
import { SessionSvcResult } from "../services/SessionService";
import {
	RoomClient,
	RoomDB,
	roomNormalizer,
} from "../utils/data/RoomNormalizer";
import {
	MemberClient,
	MemberDB,
	memberNormalizer,
} from "../utils/data/MemberNormalizer";

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

// for auth'd users
const joinRoomAsUser = async (ctx: Context) => {};

//
const joinRoomAsGuest = async (ctx: Context) => {
	const { memberID = 0, memberName } = await ctx.req.json();
	const roomCode: string = ctx.req.param("roomCode");
	const room = (await roomService.getByCode(roomCode)) as RoomDB;
	console.log("memberID", memberID);
	// if no memberID, then we create the member for that room
	if (!memberID) {
		// create member & add them to room
		const newMember = (await memberService.create(
			memberName,
			room.room_id,
			true
		)) as MemberDB;
		const joined = (await roomService.join(
			newMember.member_id,
			room.room_id
		)) as MemberDB;

		return ctx.json({
			Status: "SUCCESS",
			Message: `[${memberID}] was added to the room (${room.room_code})`,
			Data: {
				Member: { ...newMember, ...joined },
				Room: room,
			},
			ErrorMsg: null,
		});
	} else {
		// member already exists, let's add them to the room
		const member = (await roomService.join(
			memberID,
			room.room_id
		)) as MemberSvcResult;

		return ctx.json({
			Status: "SUCCESS",
			Message: `[${memberID}] was added to the room (${room.room_code})`,
			Data: {
				Member: member,
				Room: room,
			},
			ErrorMsg: null,
		});
	}
};

const joinRoomAsNewGuest = async (ctx: Context) => {
	const { displayName: memberName } = await ctx.req.json();
	const roomCode = ctx.req.param("roomCode") as string;
	console.log("memberName", memberName);

	// get room & create new member
	const roomRecord = (await roomService.getByCode(roomCode)) as RoomDB;

	const memberRecord = (await memberService.create(
		memberName,
		roomRecord.room_id,
		true
	)) as MemberDB;

	console.log("memberRecord", memberRecord);

	const room = roomNormalizer.toClientOne(roomRecord) as RoomClient;
	const newMember = memberNormalizer.toClientOne(memberRecord) as MemberClient;

	if (memberRecord instanceof Error) {
		return ctx.json({
			Status: "FAILED",
			Message: memberRecord.message,
			StackTrace: memberRecord.stack,
			Data: {
				Member: null,
				Room: null,
			},
		});
	}
	return ctx.json({
		Status: "SUCCESS",
		Message: `New member was created & added to room!`,
		Data: {
			Member: newMember,
			Room: room,
		},
	});
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

export { createRoom, joinRoom, joinRoomAsGuest, joinRoomAsNewGuest, getRoom };
