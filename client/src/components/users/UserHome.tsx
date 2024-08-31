import { useState } from "react";
import { RoomValues } from "../rooms/types";
import styles from "../../css/users/UserHome.module.scss";
import Modal from "../shared/Modal";
import CreateRoom from "../rooms/CreateRoom";

const initialValues: RoomValues = {
	roomName: "",
	memberName: "",
};

const UserHome = () => {
	const [roomValues, setRoomValues] = useState<RoomValues>(initialValues);
	const [showCreateRoomModal, setShowCreateRoomModal] =
		useState<boolean>(false);
	const [showJoinRoomModal, setShowJoinRoomModal] = useState<boolean>(false);
	const handleChange = (name: string, value: string) => {
		setRoomValues({
			...roomValues,
			[name]: value,
		});
	};

	const createRoomAndRedirect = async () => {
		const { roomName } = roomValues;
		// create room
		console.log("roomName", roomName);
	};
	const cancelRoom = () => {
		closeModal("createRoom");
	};

	// close modal & reset state
	const closeModal = (name: string) => {
		setRoomValues(initialValues);

		switch (name) {
			case "joinRoom":
				setShowJoinRoomModal(false);
				break;
			case "createRoom":
				setShowCreateRoomModal(false);
				break;

			default:
				break;
		}
	};

	return (
		<div className={styles.UserHome}>
			{/*  */}
			{/*  */}
			{/*  */}
			{showCreateRoomModal && (
				<Modal title="Create Room" closeModal={() => closeModal("createRoom")}>
					<CreateRoom
						roomValues={roomValues}
						onChange={handleChange}
						createRoom={createRoomAndRedirect}
						cancelRoom={cancelRoom}
					/>
				</Modal>
			)}
		</div>
	);
};

export default UserHome;
