import React from "react";
import classes from "./BuildControl.module.css";

const BuildControl = (props) => {
	return (
		<div className={classes.BuildControl}>
			<button
				className={classes.Less}
				onClick={props.removeIngredients}
				disabled={props.disabled}>
				-
			</button>
			<div className={classes.Label}>{props.label}</div>
			<button className={classes.More} onClick={props.addIngredients}>
				+
			</button>
		</div>
	);
};

export default BuildControl;
