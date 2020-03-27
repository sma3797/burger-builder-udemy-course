import React from "react";
import classes from "./NavigationItems.module.css";
import NavigationItem from "./NavigationItem/NavigationItem";
import Auxillary from "../../../hoc/Auxillary";

const NavigationItems = (props) => (
	<ul className={classes.NavigationItems}>
		<NavigationItem link='/' exact>
			Burger Builder
		</NavigationItem>
		{!props.isAuth ? (
			<NavigationItem link='/auth'>Auth</NavigationItem>
		) : (
			<Auxillary>
				<NavigationItem link='/orders'>Orders</NavigationItem>
				<NavigationItem link='/logout'>Logout</NavigationItem>
			</Auxillary>
		)}
	</ul>
);

export default NavigationItems;
