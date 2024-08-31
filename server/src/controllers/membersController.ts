import { Context } from "hono";
import { memberService, roomService, sessionService } from "../services";
import { RoomSvcResult } from "../services/RoomsService";
import { MemberSvcResult } from "../services/MemberService";
import { SessionSvcResult } from "../services/SessionService";

const createMember = async (ctx: Context) => {
	const body = await ctx.req.json();
	const { memberName, roomID: id, isAlive } = body;
	const roomID: number = Number(id);

	// create member
	const newMember = (await memberService.create(
		memberName,
		roomID,
		isAlive
	)) as MemberSvcResult;

	if (newMember instanceof Error) {
		return ctx.text(`Whoops! Error: ${newMember.message}`);
	}

	return ctx.json({
		MemberCreated: true,
		Member: {
			memberName: memberName,
			memberID: newMember.member_id,
			createdDate: newMember.created_date,
			roomID: newMember.room_id,
			isAlive: newMember.is_alive,
			isActive: newMember.is_active,
		},
	});
};

export { createMember };
