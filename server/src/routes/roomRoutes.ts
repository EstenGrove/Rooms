import { Context, Hono } from "hono";
import { roomService } from "../services";
import { RoomSvcResult } from "../services/RoomsService";
import { createRoom, getRoom, joinRoom } from "../controllers/roomsController";
import { ValidateExec } from "../utils/utils_validation";

const validator = new ValidateExec();

const app: Hono = new Hono();

// Room Routes:
app.post("/createRoom", createRoom);
app.post("/joinRoom/:roomCode", joinRoom);

app.get("/guid/:guid", (ctx) => {
	const guid = ctx.req.param("guid");
	const isGuid = validator.isGuid(guid);
	return ctx.text(`String is a guid: ${isGuid}`);
});

app.get("/leaveRoom/:roomCode", (ctx: Context) => {
	const { roomCode } = ctx.req.param();
	// query db for roomID via RoomService.get(roomCode)
	return ctx.text(`leaveRoom route: ${roomCode}`);
});

app.get("/some/:id", (ctx) => {
	const { id } = ctx.req.param();
	return ctx.text("ID: " + id);
});
app.get("/getRoom/:roomID", getRoom);

app.get("/test", (ctx: Context) => {
	return ctx.json({
		Message: "Hi",
	});
});

app.get("/startRoom/:roomCode", (ctx: Context) => {
	const { roomCode } = ctx.req.param();
	// 1. Update database
	//    1a. Update room, members, create session
	// 2. Create WSServer
	// 3. Send room URL to client
	return ctx.json({
		Message: `Room has started a session!`,
		Timestamp: new Date().toUTCString(),
		RoomUrl: "ws://localhost:3000/" + roomCode,
	});
	// do stuff
});
app.get("/stopRoom", (ctx: Context) => {
	// do stuff
	return ctx.text("stopRoom route");
});

export default app;
