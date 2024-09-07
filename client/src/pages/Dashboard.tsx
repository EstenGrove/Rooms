import styles from "../css/pages/Dashboard.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/store";
import { useSelector } from "react-redux";
import { resetAuth, selectCurrentUser } from "../features/auth/authSlice";
import { logout } from "../utils/utils_users";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTabs from "../components/layout/DashboardTabs";
import CreateRoomButton from "../components/rooms/CreateRoomButton";
import { CurrentUser } from "../features/auth/types";

const currentUser2 = {
	username: "EstenGrove",
	password: "SDFASDFASDF",
	displayName: "Veronica G.",
	token: "MY-TOKEN",
	loginDate: new Date(2024, 7, 31, 6, 43).toUTCString(),
};

const Dashboard = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser: CurrentUser =
		useSelector(selectCurrentUser) || currentUser2;

	const logoutUser = async () => {
		const userID = currentUser.userID || "";
		const userLogout = await logout(userID);

		if (!userLogout) {
			return alert("Shit");
		}
		// send request to server
		// dispatch state reset action
		// redirect to home page
		dispatch(resetAuth());
		navigate("/?tab=login");
	};

	const createNewRoom = async () => {
		// do stuff
	};

	console.log("currentUser", currentUser);

	return (
		<div className={styles.Dashboard}>
			<DashboardNav currentUser={currentUser} logoutUser={logoutUser} />
			<DashboardHeader currentUser={currentUser} />
			{/* DASHBOARD ROUTES */}
			<div className={styles.Dashboard_actions}>
				<CreateRoomButton onClick={createNewRoom} />
			</div>
			<div className={styles.Dashboard_main}>
				<DashboardTabs />
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
