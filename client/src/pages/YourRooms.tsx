import styles from "../css/pages/YourRooms.module.scss";
import { RoomInfo } from "../components/rooms/types";
import { useSelector } from "react-redux";
import { selectRooms, setCurrentRoom } from "../features/rooms/roomsSlice";
import { RootState, useAppDispatch } from "../store/store";
import Loading from "../components/shared/Loading";
import RoomCard from "../components/rooms/RoomCard";
import CreateRoomCard from "../components/rooms/CreateRoomCard";
import { CurrentUser } from "../features/auth/types";
import { selectCurrentUser } from "../features/auth/authSlice";
import { useState } from "react";
import { createUserRoom } from "../features/rooms/operations";
import { useNavigate } from "react-router-dom";
import { NewRoomValues } from "../components/types";
import Modal from "../components/shared/Modal";
import CreateRoom from "../components/rooms/CreateRoom";

type RoomsListProps = {
	rooms: RoomInfo[];
	goToRoom: (room: RoomInfo) => void;
	createNewRoom: () => void;
};

const RoomsList = ({ rooms, createNewRoom, goToRoom }: RoomsListProps) => {
	return (
		<>
			<CreateRoomCard onClick={createNewRoom} />
			{rooms.map((room) => (
				<RoomCard
					key={room.roomCode}
					roomInfo={room}
					selectRoom={() => goToRoom(room)}
				/>
			))}
		</>
	);
};

const initialVals: NewRoomValues = {
	roomName: "",
	startRoom: false,
	memberName: "",
};

const YourRooms = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const currentUser: CurrentUser = useSelector(selectCurrentUser);
	const userRooms: RoomInfo[] = useSelector(selectRooms);
	const isLoadingRooms: boolean =
		useSelector((state: RootState) => state.rooms.status) === "PENDING";
	// local state(s)
	const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
	const [createRoomValues, setCreateRoomValues] = useState<NewRoomValues>({
		roomName: "",
		startRoom: false,
		memberName: currentUser?.displayName || "",
	});

	const handleRoomValues = (name: string, value: string) => {
		setCreateRoomValues({
			...createRoomValues,
			[name]: value,
		});
	};

	const openCreateRoomModal = () => {
		setShowCreateRoomModal(true);
	};
	const closeCreateRoomModal = () => {
		setShowCreateRoomModal(false);
	};

	const createNewRoom = async () => {
		const { userID, memberID } = currentUser;
		const { roomName, memberName, startRoom } = createRoomValues;

		// if 'auto-start', then redirect to room page immediately
		if (startRoom) {
			dispatch(
				createUserRoom({
					userID: userID,
					memberID: memberID,
					roomName: roomName,
					memberName: memberName,
					isAlive: startRoom,
				})
			)
				.unwrap()
				.then((payload) => {
					const { Room } = payload;
					const code: string = Room.roomCode;
					// redirect to live session page, if applicable
					if (code) {
						navigate(`/sessions/${code}`);
					}
				});
		} else {
			await dispatch(
				createUserRoom({
					userID: userID,
					memberID: memberID,
					roomName: roomName,
					memberName: memberName,
					isAlive: startRoom,
				})
			);
			// not actually cancelling, just res
			resetNewRoomValues();
			closeCreateRoomModal();
		}
	};

	const resetNewRoomValues = () => {
		const { displayName } = currentUser;
		setCreateRoomValues({ ...initialVals, memberName: displayName as string });
	};

	const goToRoom = (room: RoomInfo) => {
		dispatch(
			setCurrentRoom({
				room: room,
				session: null,
				members: room.members,
			})
		);
	};

	return (
		<div className={styles.YourRooms}>
			<h2 className={styles.YourRooms_title}>Your Rooms</h2>
			<div className={styles.YourRooms_cards}>
				{isLoadingRooms && <Loading>Loading your rooms...</Loading>}
				{!!userRooms && (
					<RoomsList
						rooms={userRooms}
						createNewRoom={openCreateRoomModal}
						goToRoom={goToRoom}
					/>
				)}
			</div>

			{showCreateRoomModal && (
				<Modal title="Create Room" closeModal={closeCreateRoomModal}>
					<CreateRoom
						roomValues={createRoomValues}
						onChange={handleRoomValues}
						createRoom={createNewRoom}
						cancelRoom={resetNewRoomValues}
					/>
				</Modal>
			)}
		</div>
	);
};

export default YourRooms;
