import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import {
	createUser,
	getUser,
	loginUser,
	logoutUser,
	refreshLogin,
} from "../controllers/usersController";

const app: Hono = new Hono();

app.post("/login", loginUser);
app.get("/logout", logoutUser);
app.post("/signup", createUser);
app.post("/refresh", refreshLogin);
app.get("/getUser", getUser);

export default app;
