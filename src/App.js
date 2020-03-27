import React, { Component } from "react";
// import classes from "./App.module.css";
import Layout from "./components/Layout/Layout";
import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
// import Checkout from "./containers/Checkout/Checkout";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
// import Orders from "./containers/Orders/Orders";
// import Auth from "./containers/Auth/Auth";
import Logout from "./containers/Auth/Logout/Logout";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";
import asyncComponent from "./hoc/asyncComponent/asyncComponent";

const asyncCheckout = asyncComponent(() => {
	return import("./containers/Checkout/Checkout");
});

const asyncOrders = asyncComponent(() => {
	return import("./containers/Orders/Orders");
});

const asyncAuth = asyncComponent(() => {
	return import("./containers/Auth/Auth");
});

class App extends Component {
	componentDidMount() {
		this.props.onTryAutoSignIn();
	}

	render() {
		let routes = (
			<Switch>
				<Route path='/' exact component={BurgerBuilder} />
				<Route path='/auth' exact component={asyncAuth} />
				<Redirect to='/' />
			</Switch>
		);

		if (this.props.isAuth)
			routes = (
				<Switch>
					<Route path='/checkout' component={asyncCheckout} />
					<Route path='/orders' component={asyncOrders} />
					<Route path='/auth' exact component={asyncAuth} />
					<Route path='/logout' exact component={Logout} />
					<Route path='/' exact component={BurgerBuilder} />
					<Redirect to='/' />
				</Switch>
			);

		return (
			<div>
				<Layout>{routes}</Layout>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		isAuth: state.auth.idToken !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onTryAutoSignIn: () => dispatch(actions.authCheckStatus())
	};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
