import * as actionTypes from "./actions";

const initialState = {
	ingredients: {
		salad: 0,
		bacon: 0,
		cheese: 0,
		meat: 1
	},
	totalPrice: 4
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
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] + 1
				},
				totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName]
			};

		case actionTypes.REMOVE_INGREDIENTS:
			return {
				...state,
				ingredients: {
					...state.ingredients,
					[action.ingredientName]: state.ingredients[action.ingredientName] - 1
				},
				totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName]
			};

		default:
			return state;
	}
};

export default reducer;
