import { Context } from "hono";
import { userService } from "../services";
import {
	UserLoginResponse,
	UserLoginSvcResult,
	UserSvcResult,
} from "../services/UserService";
import { isError, UserNotFoundError } from "../utils/utils_errors";
import { ResponseModel } from "../models/ResponseModel";
import { IUserModel, UserModel } from "../models/UserModel";
import {
	ILoginSession,
	ILoginSessionModel,
	LoginSessionModel,
} from "../models/LoginSession";
import { SessionSvcResult } from "../services/SessionService";
import {
	UserLoginClient,
	userLoginNormalizer,
} from "../utils/data/UserLoginNormalizer";
import { userNormalizer } from "../utils/data/UserNormalizer";

const createUser = async (ctx: Context) => {
	const body = await ctx.req.json();
	const { username, password } = body;

	const newUserAccount = await userService.create(username, password);
	const userInfo = (await userService.login(
		username,
		password
	)) as UserLoginResponse;

	console.log("newUserAccount", newUserAccount);
	console.log("userInfo", userInfo);

	if (userInfo instanceof Error) {
		return ctx.json({
			Status: "FAILED",
			Message: userInfo,
			Data: {
				user: null,
				login: null,
			},
		});
	} else {
		return ctx.json({
			Status: "SUCCESS",
			Message: "User account was created!",
			Data: {
				User: userInfo.user,
				Session: userInfo.login,
			},
		});
	}
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

export { createUser, loginUser };
