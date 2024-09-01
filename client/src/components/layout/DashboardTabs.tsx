import React, { MouseEvent, ReactNode } from "react";
import styles from "../../css/layout/DashboardTabs.module.scss";
import { NavLink, useLocation } from "react-router-dom";

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

const DashboardTabs = () => {
	const location = useLocation();
	const isNotLive: boolean = !location.pathname.includes("/dashboard/sessions");

	return (
		<div className={styles.DashboardTabs}>
			<TabButton to="user">Home</TabButton>
			<TabButton to="rooms">Your Rooms</TabButton>
			<TabButton to="history">Room Sessions</TabButton>
			<TabButton to="settings">Settings</TabButton>
			<TabButton to="sessions" isDisabled={isNotLive}>
				Live Sessions
			</TabButton>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default DashboardTabs;
