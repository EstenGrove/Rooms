import styles from "../../css/layout/DashboardTabs.module.scss";
import sprite from "../../assets/icons/rooms2.svg";
import { MouseEvent, ReactNode } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useWindowSize } from "../../hooks/useWindowSize";

type TabButtonProps = {
	to: string;
	isDisabled?: boolean;
	children?: ReactNode;
};

interface ActiveProps {
	isActive: boolean;
	isPending: boolean;
}
const isActiveRoute = ({ isActive }: ActiveProps) => {
	if (isActive) {
		return `${styles.TabButton} ${styles.isActive}`;
	} else {
		return styles.TabButton;
	}
};

const isMobileActive = ({ isActive }: ActiveProps) => {
	if (isActive) {
		return `${styles.MobileTabButton} ${styles.isMobileActive}`;
	} else {
		return styles.MobileTabButton;
	}
};

const TabButton = ({ to, isDisabled = false, children }: TabButtonProps) => {
	// prevent clicking when disabled
	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (isDisabled) {
			e.preventDefault();
		}
	};

	return (
		<NavLink
			to={to}
			className={isActiveRoute}
			aria-disabled={isDisabled}
			onClick={handleClick}
		>
			<div className={styles.TabButton_wrapper}>{children}</div>
		</NavLink>
	);
};

const mobileIcons = {
	Home: "home_work",
	"Your Rooms": "meeting_room",
	History: "history",
	Settings: "settings",
	"Live Sessions": "supervised_user_circle",
} as const;

type MobileBtnProps = {
	to: string;
	icon: string;
	isDisabled?: boolean;
	onClick?: () => void;
};

const MobileTabButton = ({
	to,
	isDisabled = false,
	onClick,
	icon,
}: MobileBtnProps) => {
	// prevent clicking when disabled
	const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
		if (isDisabled) {
			e.preventDefault();
		}

		if (onClick) onClick();
	};
	return (
		<NavLink
			to={to}
			className={isMobileActive}
			aria-disabled={isDisabled}
			onClick={handleClick}
		>
			<div className={styles.MobileTabButton_wrapper}>
				<svg className={styles.MobileTabButton_wrapper_icon}>
					<use xlinkHref={`${sprite}#icon-${icon}`}></use>
				</svg>
			</div>
		</NavLink>
	);
};

const DashboardMobileTabs = () => {
	return (
		<div className={styles.DashboardMobileTabs}>
			<div className={styles.DashboardMobileTabs_inner}>
				<MobileTabButton to="user" icon={mobileIcons["Home"]} />
				<MobileTabButton to="rooms" icon={mobileIcons["Your Rooms"]} />
				<MobileTabButton to="history" icon={mobileIcons["History"]} />
				<MobileTabButton
					to="sessions"
					isDisabled={true}
					icon={mobileIcons["Live Sessions"]}
				/>
				<MobileTabButton to="settings" icon={mobileIcons["Settings"]} />
			</div>
		</div>
	);
};

const DashboardTabs = () => {
	const location = useLocation();
	const windowSize = useWindowSize();
	const isNotLive: boolean = !location.pathname.includes("/dashboard/sessions");

	if (windowSize.width <= 850) {
		return <DashboardMobileTabs />;
	}
	return (
		<div className={styles.DashboardTabs}>
			<TabButton to="user">Home</TabButton>
			<TabButton to="rooms">Your Rooms</TabButton>
			<TabButton to="history">History</TabButton>
			<TabButton to="settings">Settings</TabButton>
			<TabButton to="sessions" isDisabled={isNotLive}>
				Live Sessions
			</TabButton>
		</div>
	);
};

export default DashboardTabs;
