import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import {
	createUser,
	loginUser,
	logoutUser,
} from "../controllers/usersController";

const app: Hono = new Hono();

app.post("/login", loginUser);
app.get("/logout", logoutUser);
app.post("/signup", createUser);

export default app;
