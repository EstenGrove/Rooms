import styles from "../../css/users/UserHome.module.scss";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/authSlice";
import { NewRoomValues } from "../types";
import { CurrentUser } from "../../features/auth/types";
import Modal from "../shared/Modal";
import CreateRoom from "../rooms/CreateRoom";

const initialValues: NewRoomValues = {
	roomName: "",
	memberName: "",
	startRoom: false,
};

type MsgProps = {
	currentUser: CurrentUser;
	isLoading: boolean;
};
const WelcomeMessage = ({ isLoading = false, currentUser }: MsgProps) => {
	const username = currentUser?.username;
	const displayName = currentUser?.displayName;
	const welcomeName: string = displayName || username;
	const welcomeMsg = <b>{welcomeName || ""}</b>;
	return (
		<h3 className={styles.WelcomeMessage}>
			Welcome Back, {!isLoading && welcomeMsg}
		</h3>
	);
};

const UserHome = () => {
	const currentUser = useSelector(selectCurrentUser);
	const [roomValues, setRoomValues] = useState<NewRoomValues>(initialValues);
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
			<WelcomeMessage currentUser={currentUser} isLoading={false} />
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
