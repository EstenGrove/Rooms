import styles from "../css/pages/Room.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentRoom } from "../features/rooms/roomsSlice";
import { selectCurrentUser } from "../features/auth/authSlice";
import { CurrentRoom } from "../features/rooms/types";
import { CurrentUser } from "../features/auth/types";
import { deleteRoom } from "../utils/utils_rooms";
import Button from "../components/shared/Button";
import RoomInfo from "../components/rooms/RoomInfo";

const Room = () => {
	const params = useParams();
	const currentRoom: CurrentRoom = useSelector(selectCurrentRoom);
	const currentUser: CurrentUser = useSelector(selectCurrentUser);

	console.log("currentRoom", currentRoom);

	const deleteCurrentRoom = async () => {
		const { userID } = currentUser;
		const roomID = Number(currentRoom.room?.roomID);
		const wasDeleted = await deleteRoom({ roomID, userID });

		//
		console.log("wasDeleted", wasDeleted);
	};

	return (
		<div className={styles.Room}>
			{currentRoom && <RoomInfo currentRoom={currentRoom} />}
			<h1 style={{ margin: "2rem 0" }}>/room/{params?.id ?? ":id"}</h1>
			<Button onClick={deleteCurrentRoom}>Delete Room</Button>
		</div>
	);
};

export default Room;
