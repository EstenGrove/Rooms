import { Hono } from "hono";
import {
	createRoom,
	getLiveRoom,
	getUserRooms,
	joinRoom,
	joinRoomAsGuest,
	joinRoomAsNewGuest,
} from "../controllers/roomsController";

const app: Hono = new Hono();

// Room Routes:
app.get("/liveRoom", getLiveRoom);
app.get("/getRooms", getUserRooms);
app.post("/createRoom", createRoom);
app.post("/joinRoom/:roomCode", joinRoom);
app.post("/joinRoomAsGuest/:roomCode", joinRoomAsGuest);
app.post("/joinRoomAsNewGuest/:roomCode", joinRoomAsNewGuest);

export default app;
