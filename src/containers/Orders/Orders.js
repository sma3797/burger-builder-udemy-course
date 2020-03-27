import React, { Component } from "react";
import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "./../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";

class Orders extends Component {
	state = {
		// orders: [],
		// loading: true
	};

	componentDidMount() {
		this.props.onFetchOrders(this.props.idToken, this.props.userId);
		// axios
		// 	.get("/orders.json")
		// 	.then((res) => {
		// 		const fetchedOrder = [];
		// 		for (let key in res.data) {
		// 			fetchedOrder.push({
		// 				...res.data[key],
		// 				id: key
		// 			});
		// 		}
		// 		this.setState({ loading: false, orders: fetchedOrder });
		// 		// console.log(this.state.orders);
		// 	})
		// 	.catch((error) => error);
	}

	render() {
		let orders = <Spinner />;
		if (!this.props.loading)
			orders = this.props.orders.map((order) => (
				<Order
					key={order.id}
					ingredients={order.ingredients}
					price={+order.price}
				/>
			));
		return <div>{orders}</div>;
	}
}

const mapStateToProps = (state) => {
	return {
		orders: state.order.orders,
		loading: state.order.loading,
		idToken: state.auth.idToken,
		userId: state.auth.localId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchOrders: (idToken, userId) =>
			dispatch(actions.fetchOrders(idToken, userId))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(Orders, axios));
