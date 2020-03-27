import React, { Component } from "react";
import CheckoutSummary from "../../components/Order/CheckoutSummary/CheckoutSummary";
import { Route, Redirect } from "react-router-dom";
import ContactData from "./ContactData/ContactData";
import { connect } from "react-redux";

class Checkout extends Component {
	state = {
		// ingredients: null,
		// price: 0
	};

	componentWillMount() {
		// const query = new URLSearchParams(this.props.location.search);
		// const ingredients = {};
		// let price = 0;
		// for (let param of query.entries()) {
		// 	if (param[0] === "price") price = param[1];
		// 	else ingredients[param[0]] = +param[1];
		// }
		// this.setState({ ingredients: ingredients, price: price });
	}

	checkoutCancelledHandler = () => {
		this.props.history.goBack();
	};

	checkoutContinuedHandler = () => {
		this.props.history.replace("/checkout/contact-data");
	};

	render() {
		let summary = <Redirect to='/' />;
		if (this.props.ings) {
			const purchasedDone = this.props.purchased ? <Redirect to='/' /> : null;
			summary = (
				<div>
					{purchasedDone}
					<CheckoutSummary
						ingredients={this.props.ings}
						checkoutContinued={this.checkoutContinuedHandler}
						checkoutCancelled={this.checkoutCancelledHandler}
					/>
					<Route
						path={this.props.match.path + "/contact-data"}
						component={ContactData}
					/>
				</div>
			);	
		}

		return summary;
		// component={(props) => (
		// 	<ContactData
		// 		ingredients={this.state.ingredients}
		// 		price={this.state.price}
		// 		{...props}
		// 	/>
		// )}
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		purchased: state.order.purchased
	};
};

export default connect(mapStateToProps)(Checkout);
