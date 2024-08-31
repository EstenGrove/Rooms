import React, { ReactNode } from "react";
import styles from "../../css/layout/DashboardTabs.module.scss";
import { NavLink, useLocation } from "react-router-dom";

type TabButtonProps = {
	to: string;
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

const TabButton = ({ to, children }: TabButtonProps) => {
	return (
		<NavLink to={to} className={isActiveRoute}>
			<div className={styles.TabButton_wrapper}>{children}</div>
		</NavLink>
	);
};

const DashboardTabs = () => {
	const location = useLocation();
	console.log("location", location);

	return (
		<div className={styles.DashboardTabs}>
			<TabButton to="user">Home</TabButton>
			<TabButton to="rooms">Your Rooms</TabButton>
			<TabButton to="sessions">Room Sessions</TabButton>
			<TabButton to="settings">Settings</TabButton>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default DashboardTabs;
