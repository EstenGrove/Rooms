import { Context, Hono } from "hono";

const app: Hono = new Hono();

app.get("/sessions/:roomID", (ctx) => {
	return ctx.text("Session History");
});

export default app;
