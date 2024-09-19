import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { addDaysToDate } from "../utils_dates";

// Set User/Member cookies

interface MemberCookieData {
	roomID: number;
	memberID: number;
}

const setMemberCookies = (ctx: Context, data: MemberCookieData): void => {
	const { memberID, roomID } = data;
	const expiry: Date = addDaysToDate(new Date(), 12);
	setCookie(ctx, "memberID", String(memberID), {
		expires: expiry,
	});

	setCookie(ctx, "roomID", String(roomID), {
		expires: expiry,
	});
};

export { setMemberCookies };
