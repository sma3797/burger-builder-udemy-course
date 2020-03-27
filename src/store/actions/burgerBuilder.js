import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const addIngredients = (ingName) => {
	return { type: actionTypes.ADD_INGREDIENTS, ingredientName: ingName };
};

export const removeIngredients = (ingName) => {
	return { type: actionTypes.REMOVE_INGREDIENTS, ingredientName: ingName };
};

const setIngredients = (ingredients) => {
	return {
		type: actionTypes.SET_INGREDIENTS,
		ingredients: ingredients
	};
};

const fetchIngredientsFailed = () => {
	return {
		type: actionTypes.FETCH_INGREDIENTS_FAILED
	};
};

export const initIngredients = () => {
	return (dispatch) => {
		dispatch(setIngredients());
		axios
			.get("https://react-burger-builder-f5f80.firebaseio.com/ingredients.json")
			.then((response) => {
				// this.setState({ ingredients: response.data });
				dispatch(setIngredients(response.data));
			})
			.catch((error) => {
				// this.setState({ error: error });
				dispatch(fetchIngredientsFailed());
			});
	};
};
