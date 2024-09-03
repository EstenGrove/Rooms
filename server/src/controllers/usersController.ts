import { Context } from "hono";
import { userService } from "../services";
import { UserLoginResponse } from "../services/UserService";
import { isError, UserNotFoundError } from "../utils/utils_errors";

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
		.catch((err) => {
			if (err) {
				console.log("❌ Error during [LOGIN]:", err);
				return err;
			}
		})) as UserLoginResponse;

	if (isError(loginResp)) {
		return ctx.json({
			Status: "FAILED",
			Message: loginResp.message,
			StackTrace: loginResp.stack,
			Data: null,
		});
	}

	return ctx.json({
		Status: "SUCCESS",
		Message: "User was logged in successfully!",
		Data: {
			User: loginResp.user,
			Session: loginResp.login,
		},
	});
};

export { createUser, loginUser };
