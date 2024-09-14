import styles from "../../css/dashboard/DashboardNav.module.scss";
import sprite from "../../assets/icons/rooms.svg";
import UserBadge from "../users/UserBadge";
import { NavLink } from "react-router-dom";
import { CurrentUser } from "../../features/auth/types";

type Props = {
	currentUser: CurrentUser;
	logoutUser: () => void;
};

type MsgProps = {
	currentUser: CurrentUser;
};
const WelcomeMessage = ({ currentUser }: MsgProps) => {
	const username = currentUser?.username;
	const displayName = currentUser?.displayName;
	const welcomeName: string = displayName || username;
	return (
		<h3 className={styles.WelcomeMessage}>
			Welcome Back, <b>{welcomeName || ""}</b>
		</h3>
	);
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

const LogoButton = () => {
	return (
		<button type="button" className={styles.LogoButton}>
			<svg className={styles.LogoButton_icon}>
				<use xlinkHref={`${sprite}#icon-meeting_room`}></use>
			</svg>
			<span>Rooms</span>
		</button>
	);
};

const DashboardNav = ({ currentUser, logoutUser }: Props) => {
	const displayName = currentUser?.displayName ?? "";

	return (
		<nav className={styles.DashboardNav}>
			<div className={styles.DashboardNav_logo}>
				<LogoButton />
			</div>
			<div className={styles.DashboardNav_msg}>
				<WelcomeMessage currentUser={currentUser} />
			</div>
			<div className={styles.DashboardNav_options}>
				<UserBadge
					displayName={displayName as string}
					// style={{ marginLeft: "auto" }}
				/>
				<SettingsButton />
				<LogoutButton logout={logoutUser} />
			</div>
		</nav>
	);
};

export default DashboardNav;
