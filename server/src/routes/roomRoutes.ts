import { Context, Hono } from "hono";
import {
	createRoom,
	joinRoom,
	joinRoomAsGuest,
	joinRoomAsNewGuest,
} from "../controllers/roomsController";

const app: Hono = new Hono();

// Room Routes:
app.post("/createRoom", createRoom);
app.post("/joinRoom/:roomCode", joinRoom);
app.post("/joinRoomAsGuest/:roomCode", joinRoomAsGuest);
app.post("/joinRoomAsNewGuest/:roomCode", joinRoomAsNewGuest);

app.get("/joinRoomAsNewGuest/:roomCode", async (ctx: Context) => {
	const roomCode = ctx.req.param();
	console.log("roomCode", roomCode);
	return ctx.text("Hello");
});

export default app;
