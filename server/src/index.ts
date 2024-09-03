import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { basicAuth } from "hono/basic-auth";
import { API_USER } from "./utils/utils_env";
import { allRoutes } from "./routes/index";
import { userService } from "./services";

const app = new Hono();
const port = 3000;

// middleware
app.use(logger());
app.use(cors());
// app.use(basicAuth(API_USER));

app.get("/user-test", async (ctx: Context) => {
	const users = await userService.getByUsername("estengrove99@gmail.com");
	console.log("users", users);
	return ctx.json({
		Users: users,
	});
});

app.route("/users", allRoutes.users);
app.route("/rooms", allRoutes.rooms);
app.route("/members", allRoutes.members);
app.route("/sessions", allRoutes.sessions);

console.log(`✅ Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
