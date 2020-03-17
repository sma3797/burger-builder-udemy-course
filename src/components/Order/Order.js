import React, { Component } from "react";
import classes from "./Order.module.css";

class Order extends Component {
	render() {
		let ingredients = [];

		for (let ingredientName in this.props.ingredients) {
			ingredients.push({
				name: ingredientName,
				amount: this.props.ingredients[ingredientName]
			});
		}

		let mapIngredients = ingredients.map((item) => {
			return (
				<span
					key={item.name}
					style={{ textTransform: "capitalize", display: "inline-block" }}>
					{item.name} ({item.amount})
				</span>
			);
		});

		return (
			<div className={classes.Order}>
				<h3>Your order with following ingredients is as followed:</h3>
				{mapIngredients}
				<p>Total Price: {this.props.price.toFixed(2)}</p>
			</div>
		);
	}
}

export default Order;
