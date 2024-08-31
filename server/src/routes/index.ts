import roomRoutes from "./roomRoutes";
import memberRoutes from "./memberRoutes";
import sessionRoutes from "./sessionRoutes";
// declare routes

const allRoutes = {
	rooms: roomRoutes,
	members: memberRoutes,
	sessions: sessionRoutes,
};

export { allRoutes };
