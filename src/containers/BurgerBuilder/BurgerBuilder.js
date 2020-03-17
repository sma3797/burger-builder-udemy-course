import React, { Component } from "react";
import Auxillary from "../../hoc/Auxillary";
import Burger from "./../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "./../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "./../../hoc/withErrorHandler/withErrorHandler";

const INGREDIENT_PRICES = {
	salad: 0.4,
	bacon: 0.9,
	cheese: 0.7,
	meat: 1.3
};

class BurgerBuilder extends Component {
	state = {
		ingredients: {
			salad: 0,
			bacon: 0,
			cheese: 0,
			meat: 1
		},
		price: 4,
		purchasable: true,
		purchasing: false,
		loading: false,
		error: null
	};

	componentDidMount() {
		axios
			.get("https://react-burger-builder-f5f80.firebaseio.com/ingredients.json")
			.then((response) => {
				// this.setState({ ingredients: response.data });
			})
			.catch((error) => {
				this.setState({ error: error });
			});
	}

	addIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		const newCount = oldCount + 1;
		const newIngredients = { ...this.state.ingredients };
		newIngredients[type] = newCount;
		const oldPrice = this.state.price;
		const newPrice = oldPrice + INGREDIENT_PRICES[type];
		this.setState({ ingredients: newIngredients, price: newPrice });
		this.updatePurchasable(newIngredients);
	};

	removeIngredientHandler = (type) => {
		const oldCount = this.state.ingredients[type];
		if (oldCount <= 0) return;
		const newCount = oldCount - 1;
		const newIngredients = { ...this.state.ingredients };
		newIngredients[type] = newCount;
		const oldPrice = this.state.price;
		const newPrice = oldPrice - INGREDIENT_PRICES[type];
		this.setState({ ingredients: newIngredients, price: newPrice });
		this.updatePurchasable(newIngredients);
	};

	updatePurchasable = (ingredients) => {
		const sum = Object.keys(ingredients)
			.map((sum) => {
				return ingredients[sum];
			})
			.reduce((sum, el) => {
				return sum + el;
			});
		this.setState({ purchasable: sum > 0 });
	};

	purchaseHandler = () => {
		this.setState({ purchasing: true });
	};

	purchaseCancelHandler = () => {
		this.setState({ purchasing: false });
	};

	purchaseContinueHandler = () => {
		const queryParams = [];

		for (let i in this.state.ingredients) {
			queryParams.push(
				encodeURIComponent(i) +
					"=" +
					encodeURIComponent(this.state.ingredients[i])
			);
		}

		console.log(queryParams);
		queryParams.push("price=" + this.state.price);

		const queryString = queryParams.join("&");

		this.props.history.push({
			pathname: "/checkout",
			search: "?" + queryString
		});
	};

	render() {
		const disabledInfo = { ...this.state.ingredients };
		for (let key in disabledInfo) {
			disabledInfo[key] = disabledInfo[key] <= 0;
		}

		let orderSummary = null;

		let burger = this.state.error ? (
			<p>Can't fetch Ingredients</p>
		) : (
			<Spinner />
		);

		if (this.state.ingredients) {
			burger = (
				<Auxillary>
					<Burger ingredients={this.state.ingredients} />
					<BuildControls
						addIngredients={this.addIngredientHandler}
						removeIngredients={this.removeIngredientHandler}
						disabled={disabledInfo}
						price={this.state.price}
						purchasable={this.state.purchasable}
						ordered={this.purchaseHandler}
					/>
				</Auxillary>
			);
			orderSummary = (
				<OrderSummary
					ingredients={this.state.ingredients}
					purchaseCancelled={this.purchaseCancelHandler}
					purchaseContinue={this.purchaseContinueHandler}
					price={this.state.price}
				/>
			);
		}

		if (this.state.loading) orderSummary = <Spinner />;

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

export default withErrorHandler(BurgerBuilder, axios);

// export default BurgerBuilder;
