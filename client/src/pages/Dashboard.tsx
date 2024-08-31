import styles from "../css/pages/Dashboard.module.scss";
import { Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { CurrentUser, selectCurrentUser } from "../features/auth/authSlice";
import DashboardNav from "../components/dashboard/DashboardNav";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardTabs from "../components/layout/DashboardTabs";

const currentUser = {
	username: "EstenGrove",
	password: "SDFASDFASDF",
	displayName: "Veronica G.",
	token: "MY-TOKEN",
	loginDate: new Date(2024, 7, 31, 6, 43).toUTCString(),
};

const Dashboard = () => {
	const navigate = useNavigate();
	// const currentUser: CurrentUser = useSelector(selectCurrentUser);

	console.log("currentUser", currentUser);

	const logoutUser = async () => {
		console.log("clicked");
		// send request to server
		// dispatch state reset action
		// redirect to home page
		navigate("/");
	};

	return (
		<div className={styles.Dashboard}>
			<DashboardNav currentUser={currentUser} logoutUser={logoutUser} />
			<DashboardHeader currentUser={currentUser} />
			{/* DASHBOARD ROUTES */}
			<div className={styles.Dashboard_main}>
				<DashboardTabs />
				<Outlet />
			</div>
		</div>
	);
};

export default Dashboard;
