import userRoutes from "./userRoutes";
import roomRoutes from "./roomRoutes";
import memberRoutes from "./memberRoutes";
import sessionRoutes from "./sessionRoutes";
// declare routes

const allRoutes = {
	users: userRoutes,
	rooms: roomRoutes,
	members: memberRoutes,
	sessions: sessionRoutes,
};

export { allRoutes };
