import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "./../utility";

const initialState = {
	ingredients: null,
	totalPrice: 4,
	error: false,
	building: false
};

const INGREDIENT_PRICES = {
	salad: 0.4,
	bacon: 0.9,
	cheese: 0.7,
	meat: 1.3
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.ADD_INGREDIENTS:
			const updatedIngredient = {
				[action.ingredientName]: state.ingredients[action.ingredientName] + 1
			};
			const updatedIngredients = updateObject(
				state.ingredients,
				updatedIngredient
			);
			const updatedState = {
				ingredients: updatedIngredients,
				totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
				building: true
			};
			return updateObject(state, updatedState);

		case actionTypes.REMOVE_INGREDIENTS:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] - 1
				},
				totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
				building: true
			};

		case actionTypes.SET_INGREDIENTS:
			return {
				...state,
				ingredients: action.ingredients,
				error: false,
				totalPrice: 4
			};

		case actionTypes.FETCH_INGREDIENTS_FAILED:
			return {
				...state,
				error: true
			};

		default:
			return state;
	}
};

export default reducer;
