import React, { Component } from "react";
import Auxillary from "./../../hoc/Auxillary";
import classes from "./Layout.module.css";
import Toolbar from "../Navigation/Toolbar/Toolbar";
import SideDrawer from "../Navigation/SideDrawer/SideDrawer";
import { connect } from "react-redux";

class Layout extends Component {
	state = {
		showSideDrawer: false
	};

	sideDrawerClosedHandler = () => {
		this.setState({ showSideDrawer: false });
	};

	sideDrawerToggleHandler = () => {
		this.setState((prevState) => {
			return {
				showSideDrawer: !prevState.showSideDrawer
			};
		});
	};

	render() {
		return (
			<Auxillary>
				<Toolbar
					isAuth={this.props.isAuthenticated}
					drawerToggle={this.sideDrawerToggleHandler}
				/>
				<SideDrawer
					open={this.state.showSideDrawer}
					closed={this.sideDrawerClosedHandler}
				/>
				<main className={classes.Content}>{this.props.children}</main>
			</Auxillary>
		);
	}
}

const mapStateToPorps = (state) => {
	return {
		isAuthenticated: state.auth.idToken !== null
	};
};

export default connect(mapStateToPorps)(Layout);
