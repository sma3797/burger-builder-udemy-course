import React from "react";
import Auxillary from "../../../hoc/Auxillary";
import Button from "./../../UI/Button/Button";

const OrderSummary = (props) => {
	const ingredientsSummary = Object.keys(props.ingredients).map((igKey) => (
		<li key={igKey}>
			<span style={{ textTransform: "capitalize" }}>{igKey}</span> :{" "}
			{props.ingredients[igKey]}
		</li>
	));

	return (
		<Auxillary>
			<h3>Your Order</h3>
			<p>A Delicious burger with the following ingredients</p>
			<ul>{ingredientsSummary}</ul>
			<p>
				<strong>Total Price : {props.price.toFixed(2)} PKR</strong>
			</p>
			<p>Continue to Checkout?</p>
			<Button btnType='Danger' clicked={props.purchaseCancelled}>
				CANCEL
			</Button>
			<Button btnType='Success' clicked={props.purchaseContinue}>
				CONTINUE
			</Button>
		</Auxillary>
	);
};

export default OrderSummary;
