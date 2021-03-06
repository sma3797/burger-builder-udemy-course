import React, { Component } from "react";
import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import { connect } from "react-redux";
import withErrorHandler from "./../../../hoc/withErrorHandler/withErrorHandler";
import * as orderActions from "../../../store/actions/index";

class ContactData extends Component {
	state = {
		// loading: false,
		formIsValid: false,
		orderForm: {
			name: {
				elementType: "input",
				elementConfig: {
					type: "text",
					placeholder: "Your Name"
				},
				value: "",
				validation: {
					required: true
				},
				valid: false,
				touched: false
			},
			// street: {
			// 	elementType: "input",
			// 	elementConfig: {
			// 		type: "text",
			// 		placeholder: "Your Street"
			// 	},
			// 	value: "",
			// 	validation: {
			// 		required: true
			// 	},
			// 	valid: false,
			// 	touched: false
			// },
			// email: {
			// 	elementType: "input",
			// 	elementConfig: {
			// 		type: "email",
			// 		placeholder: "Your Email"
			// 	},
			// 	value: "",
			// 	validation: {
			// 		required: true
			// 	},
			// 	valid: false,
			// 	touched: false
			// },
			// country: {
			// 	elementType: "input",
			// 	elementConfig: {
			// 		type: "text",
			// 		placeholder: "Your Country"
			// 	},
			// 	value: "",
			// 	validation: {
			// 		required: true
			// 	},
			// 	valid: false,
			// 	touched: false
			// },
			// zipCode: {
			// 	elementType: "input",
			// 	elementConfig: {
			// 		type: "text",
			// 		placeholder: "Your Zip Code"
			// 	},
			// 	value: "",
			// 	validation: {
			// 		required: true,
			// 		minLength: 3,
			// 		maxLength: 5
			// 	},
			// 	valid: false,
			// 	touched: false
			// },
			deliveryMethod: {
				elementType: "select",
				elementConfig: {
					options: [
						{ value: "fastest", displayValue: "Fastest" },
						{ value: "cheapest", displayValue: "Cheapest" }
					]
				},
				validation: {
					required: true
				},
				value: "fastest",
				valid: true
			}
		}
	};

	orderHandler = (event) => {
		event.preventDefault();
		this.setState({ loading: true });

		const formData = {};
		for (let formElement in this.state.orderForm) {
			formData[formElement] = this.state.orderForm[formElement].value;
		}
		// console.log(formData);

		const order = {
			ingredients: this.props.ings,
			price: this.props.price,
			orderData: formData,
			userId: this.props.userId
		};

		this.props.onOrderBurger(order, this.props.token);
		// axios
		// 	.post("/orders.json", order)
		// 	.then((response) => {
		// 		// console.log(response);
		// 		this.setState({ loading: false });
		// 		this.props.history.push("/");
		// 	})
		// 	.catch((error) => {
		// 		// console.log(error);
		// 		this.setState({ loading: false });
		// 	});
	};

	checkValidity(value, rules) {
		let isValid = true;

		if (rules.required) {
			isValid = value.trim() !== "" && isValid;
		}

		if (rules.minLength) {
			isValid = value.length >= rules.minLength && isValid;
		}

		if (rules.maxLength) {
			isValid = value.length <= rules.maxLength && isValid;
		}

		return isValid;
	}

	changedHandler = (event, formElement) => {
		const updatedForm = { ...this.state.orderForm };
		const updatedElement = { ...updatedForm[formElement] };
		updatedElement.value = event.target.value;
		updatedElement.valid = this.checkValidity(
			updatedElement.value,
			updatedElement.validation
		);
		updatedElement.touched = true;
		updatedForm[formElement] = updatedElement;

		let formIsValid = true;
		for (let elementKey in updatedForm) {
			formIsValid = updatedForm[elementKey].valid && formIsValid;
		}

		// console.log(updatedForm);
		this.setState({ orderForm: updatedForm, formIsValid: formIsValid });
	};

	render() {
		let formElementsArray = [];
		for (let key in this.state.orderForm) {
			formElementsArray.push({
				id: key,
				config: this.state.orderForm[key]
			});
		}

		let form = (
			<form onSubmit={this.orderHandler}>
				{formElementsArray.map((formElement) => (
					<Input
						key={formElement.id}
						elementType={formElement.config.elementType}
						elementConfig={formElement.config.elementConfig}
						value={formElement.config.value}
						inValid={!formElement.config.valid}
						shouldValidate={formElement.config.validation}
						touched={formElement.config.touched}
						changed={(event) => this.changedHandler(event, formElement.id)}
					/>
				))}
				<Button btnType='Success' disabled={!this.state.formIsValid}>
					ORDER
				</Button>
			</form>
		);

		if (this.props.loading) form = <Spinner />;

		return (
			<div className={classes.ContactData}>
				<h4>Enter Your Contact Data</h4>
				{form}
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		loading: state.order.loading,
		token: state.auth.idToken,
		userId: state.auth.localId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onOrderBurger: (orderData, token) =>
			dispatch(orderActions.purchaseBurger(orderData, token))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(ContactData, axios));
