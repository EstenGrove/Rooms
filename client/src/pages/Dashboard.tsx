import styles from "../css/pages/Dashboard.module.scss";
import { useCallback, useEffect, useState } from "react";
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
import {
	AuthSession,
	clearAuthFromStorage,
	getAuthFromStorage,
} from "../utils/utils_auth";
import { useAuthSession } from "../hooks/useAuthSession";
import { fetchUserRooms } from "../features/rooms/operations";
import Modal from "../components/shared/Modal";
import CreateRoom from "../components/rooms/CreateRoom";
import DashboardTabs from "../components/layout/DashboardTabs";
import DashboardNav from "../components/dashboard/DashboardNav";
import Loading from "../components/shared/Loading";

interface NewRoomValues {
	roomName: string;
	memberName: string;
	startRoom: boolean;
}

const Dashboard = () => {
	const navigate = useNavigate();
	const authCache: AuthSession = getAuthFromStorage();
	const dispatch = useAppDispatch();
	useAuthSession({
		onSuccess: (session: AuthSession) => {
			// do something
			console.log("Success!", session);
		},
		onReject: async () => {
			console.log("Rejected Auth");
			await logoutUser();
			// navigate("/?tab=login");
		},
	});
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
		//
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
			console.log("Firing...");
			getInitialResources();
		}

		return () => {
			isMounted = false;
		};
	}, [currentUser?.userID, getInitialResources]);

	return (
		<div className={styles.Dashboard}>
			<div className={styles.Dashboard_loader}>
				{isLoading && (
					<Loading style={{ minHeight: "25rem" }}>
						Loading details...please wait..
					</Loading>
				)}
			</div>
			{!isLoading && (
				<>
					<DashboardNav currentUser={currentUser} logoutUser={logoutUser} />
					<DashboardTabs initCreateRoom={openCreateRoomModal} />
				</>
			)}
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
