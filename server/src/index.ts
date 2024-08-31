import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { logger } from "hono/logger";
import { basicAuth } from "hono/basic-auth";
import { API_USER } from "./utils/utils_env";
import { allRoutes } from "./routes/index";
import { queryService } from "./services";
import { cors } from "hono/cors";

const app = new Hono();
const port = 3000;

// middleware
app.use(logger());
app.use(cors());
// app.use(basicAuth(API_USER));

app.get("/", async (ctx: Context) => {
	const results = await queryService.select("SELECT * FROM rooms");
	console.log("results", results);
	return ctx.text("Server is alive!");
});
app.route("/rooms", allRoutes.rooms);
app.route("/members", allRoutes.members);
app.route("/sessions", allRoutes.sessions);

console.log(`✅ Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});
