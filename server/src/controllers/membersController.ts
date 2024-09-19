import { Context } from "hono";
import { memberService, roomService, sessionService } from "../services";
import { RoomSvcResult } from "../services/RoomsService";
import { MemberSvcResult } from "../services/MemberService";
import { SessionSvcResult } from "../services/SessionService";
import { setCookie } from "hono/cookie";
import { memberNormalizer } from "../utils/data/MemberNormalizer";
import { getResponseError, getResponseOk } from "../models/ResponseModel";
import { addDaysToDate } from "../utils/utils_dates";

const createMember = async (ctx: Context) => {
	const body = await ctx.req.json();
	const { memberName, roomID: id, isAlive } = body;
	const roomID: number = Number(id);

	// create member
	const rawMember = (await memberService.create(
		memberName,
		roomID,
		isAlive
	)) as MemberSvcResult;

	if (rawMember instanceof Error) {
		const errResponse = getResponseError(new Error(rawMember.message), {
			Member: null,
		});
		return ctx.json(errResponse);
	}

	const newMember = memberNormalizer.toClientOne(rawMember);

	const expiry: Date = addDaysToDate(new Date(), 12);
	setCookie(ctx, "memberID", String(newMember.memberID), {
		expires: expiry,
	});
	setCookie(ctx, "memberName", newMember.memberName, {
		expires: expiry,
	});
	setCookie(ctx, "roomID", String(roomID), {
		expires: expiry,
	});

	const response = getResponseOk({
		MemberCreated: true,
		Member: newMember,
	});

	return ctx.json(response);
};

export { createMember };
