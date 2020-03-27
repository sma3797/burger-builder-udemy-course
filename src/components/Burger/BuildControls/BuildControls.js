import React from "react";
import classes from "./BuildControls.module.css";
import BuildControl from "./BuildControl/BuildControl";

const controls = [
	{ label: "Salad", type: "salad" },
	{ label: "Bacon", type: "bacon" },
	{ label: "Cheese", type: "cheese" },
	{ label: "Meat", type: "meat" }
];

const BuildControls = (props) => {
	return (
		<div className={classes.BuildControls}>
			<p>
				Current Price: <strong>{props.price.toFixed(2)} PKR</strong>
			</p>
			{controls.map((bldCntrl) => (
				<BuildControl
					key={bldCntrl.label}
					label={bldCntrl.label}
					type={bldCntrl.type}
					addIngredients={() => props.addIngredients(bldCntrl.type)}
					removeIngredients={() => props.removeIngredients(bldCntrl.type)}
					disabled={props.disabled[bldCntrl.type]}
				/>
			))}
			<button
				disabled={!props.purchasable}
				className={classes.OrderButton}
				onClick={props.ordered}>
				{props.isAuth ? "ORDER NOW" : "SIGN IN TO ORDER"}
			</button>
		</div>
	);
};

export default BuildControls;
