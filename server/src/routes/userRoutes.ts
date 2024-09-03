import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import { createUser, loginUser } from "../controllers/usersController";

const app: Hono = new Hono();

app.post("/login", loginUser);
app.post("/signup", createUser);

export default app;
