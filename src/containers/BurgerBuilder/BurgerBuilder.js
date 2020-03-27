import React, { Component } from "react";
import Auxillary from "../../hoc/Auxillary";
import Burger from "./../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "./../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "./../../hoc/withErrorHandler/withErrorHandler";

import * as BurgerBuilderActions from "./../../store/actions/index";

import { connect } from "react-redux";

class BurgerBuilder extends Component {
	state = {
		// ingredients: {
		// 	salad: 0,
		// 	bacon: 0,
		// 	cheese: 0,
		// 	meat: 1
		// },
		// price: 4,
		purchasable: true,
		purchasing: false
		// loading: false,
		// error: null
	};

	componentDidMount() {
		this.props.onInitIngredients();
		// axios
		// 	.get("https://react-burger-builder-f5f80.firebaseio.com/ingredients.json")
		// 	.then((response) => {
		// 		// this.setState({ ingredients: response.data });
		// 	})
		// 	.catch((error) => {
		// 		this.setState({ error: error });
		// 	});
	}

	// addIngredientHandler = (type) => {
	// 	const oldCount = this.props.ings[type];
	// 	const newCount = oldCount + 1;
	// 	const newIngredients = { ...this.props.ings };
	// 	newIngredients[type] = newCount;
	// 	const oldPrice = this.state.price;
	// 	const newPrice = oldPrice + INGREDIENT_PRICES[type];
	// 	this.setState({ ingredients: newIngredients, price: newPrice });
	// 	this.updatePurchasable(newIngredients);
	// };

	// removeIngredientHandler = (type) => {
	// 	const oldCount = this.props.ings[type];
	// 	if (oldCount <= 0) return;
	// 	const newCount = oldCount - 1;
	// 	const newIngredients = { ...this.props.ings };
	// 	newIngredients[type] = newCount;
	// 	const oldPrice = this.state.price;
	// 	const newPrice = oldPrice - INGREDIENT_PRICES[type];
	// 	this.setState({ ingredients: newIngredients, price: newPrice });
	// 	this.updatePurchasable(newIngredients);
	// };

	updatePurchasable = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((sum) => {
				return ingredients[sum];
			})
			.reduce((sum, el) => {
				// console.log(sum, el);
				return sum + el;
			});
		return sum > 0;
	};

	purchaseHandler = () => {
		if (this.props.isAuth) this.setState({ purchasing: true });
		else {
			this.props.onSetRedirectAuth("/checkout");
			this.props.history.push("/auth");
		}
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		// const queryParams = [];
		// for (let i in this.props.ings) {
		// 	queryParams.push(
		// 		encodeURIComponent(i) + "=" + encodeURIComponent(this.props.ings[i])
		// 	);
		// }
		// console.log(queryParams);
		// queryParams.push("price=" + this.state.price);
		// const queryString = queryParams.join("&");
		// this.props.history.push({
		// 	pathname: "/checkout",
		// 	search: "?" + queryString
		// });
		this.props.onInitPurchase();
		this.props.history.push("/checkout");
	};

	render() {
		const disabledInfo = { ...this.props.ings };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;

		let burger = this.props.error ? (
			<p>Can't fetch Ingredients</p>
		) : (
			<Spinner />
		);

		if (this.props.ings) {
			burger = (
				<Auxillary>
					<Burger ingredients={this.props.ings} />
					<BuildControls
						addIngredients={this.props.onIngredientsAdded}
						removeIngredients={this.props.onIngredientsRemoved}
						disabled={disabledInfo}
						price={this.props.price}
						isAuth={this.props.isAuth}
						purchasable={this.updatePurchasable(this.props.ings)}
						ordered={this.purchaseHandler}
					/>
				</Auxillary>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.props.ings}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinue={this.purchaseContinueHandler}
					price={this.props.price}
				/>
			);
		}

		// if (this.state.loading) orderSummary = <Spinner />;

		return (
			<Auxillary>
				<Modal
					show={this.state.purchasing}
					modalClosed={this.purchaseCancelHandler}>
					{orderSummary}
				</Modal>
				{burger}
			</Auxillary>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuth: state.auth.idToken !== null
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onIngredientsAdded: (ingName) =>
			dispatch(BurgerBuilderActions.addIngredients(ingName)),
		onIngredientsRemoved: (ingName) =>
			dispatch(BurgerBuilderActions.removeIngredients(ingName)),
		onInitIngredients: () => dispatch(BurgerBuilderActions.initIngredients()),
		onInitPurchase: () => dispatch(BurgerBuilderActions.purchaseInit()),
		onSetRedirectAuth: (path) =>
			dispatch(BurgerBuilderActions.setAuthRedirectPath(path))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));

// export default BurgerBuilder;
