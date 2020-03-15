import React from "react";
import classes from "./Toolbar.module.css";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";
import DrawerToggle from "../SideDrawer/DrawerToggle/DrawerToggle";

const Toolbar = (props) => {
	return (
		<header className={classes.Toolbar}>
			<DrawerToggle clicked={props.drawerToggle} />
			<div className={classes.Logo}>
				<Logo />
			</div>
			<div className={classes.desktopOnly}>
				<NavigationItems />
			</div>
		</header>
	);
};

export default Toolbar;
