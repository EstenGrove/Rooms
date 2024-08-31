import { Context, Hono } from "hono";
import { createMember } from "../controllers/membersController";

const app: Hono = new Hono();

// Member Routes:
app.post("/createMember", createMember);

app.get("/updateMember", (ctx: Context) => {
	// do stuff
	return ctx.text("updateMember route");
});

export default app;
