import styles from "../../css/dashboard/DashboardNav.module.scss";
import sprite from "../../assets/icons/rooms.svg";
import UserBadge from "../users/UserBadge";
import { NavLink } from "react-router-dom";
import { CurrentUser } from "../../features/auth/types";

type Props = {
	currentUser: CurrentUser;
	logoutUser: () => void;
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

const DashboardNav = ({ currentUser, logoutUser }: Props) => {
	const displayName = currentUser?.displayName ?? "";

	return (
		<nav className={styles.DashboardNav}>
			<UserBadge displayName={displayName as string} />
			<SettingsButton />
			<LogoutButton logout={logoutUser} />
		</nav>
	);
};

export default DashboardNav;
