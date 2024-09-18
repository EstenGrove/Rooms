import styles from "../css/pages/Dashboard.module.scss";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { logout } from "../utils/utils_users";
import { CurrentUser } from "../features/auth/types";
import { resetAuth, selectCurrentUser } from "../features/auth/authSlice";
import {
	AuthSession,
	clearAuthFromStorage,
	getAuthFromStorage,
} from "../utils/utils_auth";
import { useAuthSession } from "../hooks/useAuthSession";
import { createUserRoom, fetchUserRooms } from "../features/rooms/operations";
import Modal from "../components/shared/Modal";
import CreateRoom from "../components/rooms/CreateRoom";
import DashboardNav from "../components/dashboard/DashboardNav";
import { NewRoomValues } from "../components/types";

const Dashboard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const authCache: AuthSession = getAuthFromStorage();
	const currentUser: CurrentUser = useSelector(selectCurrentUser);
	useAuthSession({
		onSuccess: () => {
			// do something
		},
		onReject: async () => {
			await logoutUser();
		},
	});

	const [showCreateRoomModal, setShowCreateRoomModal] =
		useState<boolean>(false);
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
		const { displayName } = currentUser;
		setShowCreateRoomModal(true);
		handleRoomValues("memberName", displayName as string);
	};
	const closeCreateRoomModal = () => {
		setShowCreateRoomModal(false);
		handleRoomValues("roomName", "");
	};

	const logoutUser = async () => {
		const userID = currentUser?.userID || (authCache.userID as string);
		const userLogout = await logout(userID);

		if (!userLogout) {
			return alert("Shit");
		}
		clearAuthFromStorage();
		dispatch(resetAuth());
		navigate("/?tab=login");
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
					navigate(`/sessions/${code}`);
				});
		} else {
			dispatch(
				createUserRoom({
					userID: userID,
					memberID: memberID,
					roomName: roomName,
					memberName: memberName,
					isAlive: startRoom,
				})
			);
		}
	};
	const cancelNewRoom = () => {
		closeCreateRoomModal();
	};

	const getInitialResources = useCallback(() => {
		const authCache = getAuthFromStorage();
		const userID = (currentUser?.userID || authCache?.userID) as string;
		if (!userID) return;

		dispatch(fetchUserRooms(userID));
	}, [currentUser?.userID, dispatch]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (currentUser?.userID) {
			getInitialResources();
		}

		return () => {
			isMounted = false;
		};
	}, [currentUser?.userID, getInitialResources]);

	return (
		<div className={styles.Dashboard}>
			<DashboardNav
				currentUser={currentUser}
				logoutUser={logoutUser}
				initCreateRoom={openCreateRoomModal}
			/>
			{/* DASHBOARD ROUTES */}
			<div className={styles.Dashboard_main}>
				<Outlet />
			</div>

			{showCreateRoomModal && (
				<Modal title="Create Room" closeModal={closeCreateRoomModal}>
					<CreateRoom
						roomValues={createRoomValues}
						onChange={handleRoomValues}
						createRoom={createNewRoom}
						cancelRoom={cancelNewRoom}
					/>
				</Modal>
			)}
		</div>
	);
};

export default Dashboard;
