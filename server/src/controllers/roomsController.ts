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
import { ValidateExec } from "../utils/utils_validation";
import { getResponseError, getResponseOk } from "../models/ResponseModel";
import { SessionDB, sessionNormalizer } from "../utils/data/SessionNormalizer";

const validator = new ValidateExec();

// create a new room
// - member should be an ID not a name, as the member should be created separately

// 1. Create Room
// 2. Update member's name, if different
const createRoom = async (ctx: Context) => {
	const body = await ctx.req.json();
	const { userID, memberID, roomName, memberName, isAlive = false } = body;

	const rawRoom = (await roomService.create(
		roomName as string,
		isAlive as boolean
	)) as RoomSvcResult;

	// normalized data
	const newRoom = roomNormalizer.toClientOne(rawRoom) as RoomClient;

	console.log("Was Created:", newRoom);

	const response = getResponseOk({
		Room: newRoom,
		IsAlive: newRoom.isAlive,
	});

	return ctx.json(response);
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

	if (!validator.isGuid(roomCode)) {
		const errMsg: string = "Room code is not valid: " + roomCode;
		const errResponse = getResponseError(new Error(errMsg), {
			Member: null,
			Room: null,
		});

		return ctx.json(errResponse);
	}

	// get room & create new member
	const roomRecord = (await roomService.getByCode(roomCode)) as RoomDB;

	if (roomRecord instanceof Error) {
		const errResponse = getResponseError(roomRecord, {
			Member: null,
			Room: null,
		});

		return ctx.json(errResponse);
	}

	const memberRecord = (await memberService.create(
		memberName,
		roomRecord.room_id,
		true
	)) as MemberDB;

	console.log("memberRecord", memberRecord);

	const room = roomNormalizer.toClientOne(roomRecord) as RoomClient;
	const newMember = memberNormalizer.toClientOne(memberRecord) as MemberClient;

	if (memberRecord instanceof Error) {
		const errMsg: string =
			"Display names MUST be unique per room. Consider adding an initial.";
		const errResponse = getResponseError(new Error(errMsg), {
			Member: null,
			Room: null,
		});
		return ctx.json(errResponse);
	}

	const okResponse = getResponseOk({
		Member: newMember,
		Room: room,
	});

	// Success: member was created & added to room
	return ctx.json({
		...okResponse,
		Message: "New member was created & added to room!",
	});
};

const getLiveRoom = async (ctx: Context) => {
	const { roomCode, memberID } = ctx.req.query();
	// Result: Room, Member, Session, Members
	const roomDB = (await roomService.getByCode(roomCode)) as RoomDB;
	const memberDB = (await memberService.getByID(Number(memberID))) as MemberDB;
	const sessionDB = (await sessionService.getByRoomID(
		roomDB?.room_id
	)) as SessionDB;
	const roomMembersDB = (await roomService.getMembers(
		roomDB?.room_id
	)) as MemberDB[];

	// start session if not already
	// const started = await sessionService.start(sessionDB?.session_id);

	// normalized data
	const liveRoom = roomNormalizer.toClientOne(roomDB);
	const member = memberNormalizer.toClientOne(memberDB);
	const session = sessionNormalizer.toClientOne(sessionDB);
	const members = memberNormalizer.toClient(roomMembersDB);

	const response = getResponseOk({
		Member: member,
		Session: session,
		Members: members,
		Room: liveRoom,
	});

	return ctx.json(response);
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

const getUserRooms = async (ctx: Context) => {
	const userID = ctx.req.query("userID") as string;
	const rooms = (await roomService.getRoomsByUser(userID)) as RoomDB[];
	const userRooms = roomNormalizer.toClient(rooms) as RoomClient[];

	console.log("rooms", rooms);
	const response = getResponseOk({
		Rooms: userRooms,
	});
	return ctx.json(response);
};

export {
	createRoom,
	joinRoom,
	joinRoomAsGuest,
	joinRoomAsNewGuest,
	getRoom,
	getLiveRoom,
	getUserRooms,
};
