import { useCallback, useEffect, useState } from "react";
import styles from "../css/pages/Dashboard.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store/store";
import { logout } from "../utils/utils_users";
import { CurrentUser } from "../features/auth/types";
import {
	resetAuth,
	selectCurrentUser,
	selectIsLoadingState,
} from "../features/auth/authSlice";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTabs from "../components/layout/DashboardTabs";
import CreateRoomButton from "../components/rooms/CreateRoomButton";
import Modal from "../components/shared/Modal";
import CreateRoom from "../components/rooms/CreateRoom";
import {
	AuthSession,
	clearAuthFromStorage,
	getAuthFromStorage,
} from "../utils/utils_auth";
import { useAuthSession } from "../hooks/useAuthSession";
import { fetchUserRooms } from "../features/rooms/operations";

interface NewRoomValues {
	roomName: string;
	memberName: string;
	startRoom: boolean;
}

const Dashboard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	// const { authSession } = useAuthSession({
	// 	onSuccess: (session: AuthSession) => {
	// 		// do something
	// 		console.log("Succcess!");
	// 	},
	// 	onReject: () => {
	// 		console.log("Reject");
	// 		navigate("/?tab=login");
	// 	},
	// });
	const isLoading: boolean = useSelector(selectIsLoadingState);
	const currentUser: CurrentUser = useSelector(selectCurrentUser);

	const [createRoomValues, setCreateRoomValues] = useState<NewRoomValues>({
		roomName: "",
		memberName: currentUser?.displayName as string,
		startRoom: false,
	});
	const [showCreateRoomModal, setShowCreateRoomModal] =
		useState<boolean>(false);

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
		const userID = currentUser.userID || "";
		const userLogout = await logout(userID);

		if (!userLogout) {
			return alert("Shit");
		}
		clearAuthFromStorage();
		dispatch(resetAuth());
		navigate("/?tab=login");
	};

	const createNewRoom = async () => {
		// do stuff
	};
	const cancelNewRoom = () => {
		closeCreateRoomModal();
	};

	const getInitialResources = useCallback(() => {
		const authCache = getAuthFromStorage();
		const userID = (currentUser?.userID || authCache?.userID) as string;
		if (!userID) return;

		console.log("userID", userID);
		// dispatch()
		dispatch(fetchUserRooms(userID));
	}, [currentUser?.userID, dispatch]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (currentUser?.userID) {
			console.log("Firing...");
			getInitialResources();
		}

		return () => {
			isMounted = false;
		};
	}, [currentUser?.userID, getInitialResources]);

	return (
		<div className={styles.Dashboard}>
			{isLoading && <div>Loading details...please wait..</div>}
			{!isLoading && (
				<>
					<DashboardNav currentUser={currentUser} logoutUser={logoutUser} />
					<DashboardHeader currentUser={currentUser} />
					{/* DASHBOARD ROUTES */}
					<div className={styles.Dashboard_actions}>
						<CreateRoomButton onClick={openCreateRoomModal} />
					</div>
					<div className={styles.Dashboard_main}>
						<DashboardTabs />
						<Outlet />
					</div>
				</>
			)}

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
