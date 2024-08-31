import styles from "../../css/dashboard/DashboardNav.module.scss";
import sprite from "../../assets/icons/rooms.svg";
import UserBadge from "../users/UserBadge";
import { CurrentUser } from "../../features/auth/authSlice";
import { NavLink, redirect } from "react-router-dom";

type Props = {
	currentUser: CurrentUser;
};

const SettingsButton = () => {
	return (
		<NavLink to="/dashboard/settings" className={styles.SettingsButton}>
			<svg className={styles.SettingsButton_icon}>
				<use xlinkHref={`${sprite}#icon-settings`}></use>
			</svg>
		</NavLink>
	);
};

type LogoutBtnProps = {
	logout: () => void;
};

const LogoutButton = ({ logout }: LogoutBtnProps) => {
	return (
		<button type="button" onClick={logout} className={styles.LogoutButton}>
			<svg className={styles.LogoutButton_icon}>
				<use xlinkHref={`${sprite}#icon-exit_to_app`}></use>
			</svg>
		</button>
	);
};

const DashboardNav = ({ currentUser }: Props) => {
	const { displayName } = currentUser;

	const logoutUser = async () => {
		// send request to server
		// dispatch state reset action
		// redirect to home page
		redirect("/");
	};

	return (
		<nav className={styles.DashboardNav}>
			<UserBadge displayName={displayName} />
			<SettingsButton />
			<LogoutButton logout={logoutUser} />
		</nav>
	);
};

export default DashboardNav;
