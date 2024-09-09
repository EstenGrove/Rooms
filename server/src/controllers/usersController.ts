import { Context } from "hono";
import { memberService, userLoginService, userService } from "../services";
import {
	UserLoginResponse,
	UserLoginSvcResult,
	UserSvcResult,
} from "../services/UserService";
import { isError } from "../utils/utils_errors";
import { getResponseOk, ResponseModel } from "../models/ResponseModel";
import {
	UserLoginClient,
	UserLoginDB,
	userLoginNormalizer,
} from "../utils/data/UserLoginNormalizer";
import {
	UserClient,
	UserDB,
	userNormalizer,
} from "../utils/data/UserNormalizer";
import {
	MemberClient,
	MemberDB,
	memberNormalizer,
} from "../utils/data/MemberNormalizer";

const createUser = async (ctx: Context) => {
	const body = await ctx.req.json();
	const { username, password } = body;

	// check if user/username already exists
	const userAlreadyExists = (await userService.getByUsername(
		username
	)) as UserSvcResult;

	if (userAlreadyExists || isError(userAlreadyExists)) {
		return ctx.json({
			Status: "FAILED",
			ErrorMsg: "Username is taken. Try another.",
			Data: {
				User: null,
				Session: null,
				Member: null,
			},
		});
	}

	// Create a new user, member & login session record: set default room, displayName values
	const newUserAcct = (await userService.create(username, password)) as UserDB;
	const newMemberAcct = (await memberService.create(
		username,
		1,
		false
	)) as MemberDB;
	// fetch the auto-created login session record for the new user
	const newLoginRecord = (await userLoginService.getByUserID(
		newUserAcct.user_id
	)) as UserLoginDB;

	// normalized data
	const newUser: UserClient = userNormalizer.toClientOne(
		newUserAcct
	) as UserClient;
	const newMember: MemberClient = memberNormalizer.toClientOne(
		newMemberAcct as MemberDB
	);
	const newLogin: UserLoginClient = userLoginNormalizer.toClientOne(
		newLoginRecord as UserLoginDB
	) as UserLoginClient;

	// ##TODO:
	// - Add JWT generator
	// - Set JWT to httponly cookie

	return ctx.json({
		Status: "SUCCESS",
		Message: "Username is available!",
		Data: {
			User: newUser,
			Session: newLogin,
			Member: newMember,
		},
	});
};

const loginUser = async (ctx: Context) => {
	const { username, password } = await ctx.req.json();

	if (!username || !password) {
		return ctx.text("User credentials are [REQUIRED] for login.");
	}

	const loginResp = (await userService
		.login(username, password)
		.catch((err) => err)) as UserLoginResponse;

	// if error; return it
	if (isError(loginResp.error)) {
		const errResp = new ResponseModel({
			status: "FAILED",
			data: { User: null, Session: null },
			errorMsg: loginResp.error.message,
			errorStack: loginResp.error.stack,
		});

		return ctx.json(errResp);
	}

	const user = userNormalizer.toClientOne(loginResp.user as UserSvcResult);
	const loginSession = userLoginNormalizer.toClientOne(
		loginResp.login as UserLoginSvcResult
	);

	const resp = new ResponseModel({
		status: "SUCCESS",
		msg: "User was logged in successfully!",
		data: { User: user, Session: loginSession },
		errorMsg: null,
	});

	return ctx.json(resp);
};

const logoutUser = async (ctx: Context) => {
	const userID = ctx.req.query("userID") as string;
	const session = (await userService.logout(userID)) as UserLoginSvcResult;
	const wasLoggedOut: boolean = !!session as boolean;
	const logoutDate = session.logout_date as string;

	console.log("userID", userID);
	console.log("session", session);

	if (!wasLoggedOut || isError(session)) {
		return ctx.json({
			Status: "FAILED",
			Message: "Logout action failed for " + userID,
			ErrorMsg: session,
		});
	} else {
		return ctx.json({
			Status: "SUCCESS",
			Message: `[${userID}] was logged out at: ${logoutDate} `,
			Data: {
				UserID: userID,
				Session: session,
			},
		});
	}
};

const refreshLogin = async (ctx: Context) => {
	const userID = ctx.req.query("userID") as string;
	const loginSession = (await userService.authenticate(userID)) as UserLoginDB;

	const updatedSession = userLoginNormalizer.toClientOne(
		loginSession
	) as UserLoginClient;
	const response = getResponseOk({
		UserLogin: updatedSession,
	});
	return ctx.json(response);
};

const getUser = async (ctx: Context) => {
	const userID = ctx.req.query("userID") as string;
	const userData = (await userService.getByID(userID)) as UserDB;
	const currentUser = userNormalizer.toClientOne(userData) as UserClient;

	const response = getResponseOk({
		User: currentUser,
	});
	return ctx.json(response);
};

export { createUser, loginUser, logoutUser, refreshLogin, getUser };
