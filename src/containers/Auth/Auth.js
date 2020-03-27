import React, { Component } from "react";
import Input from "./../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.module.css";
import * as actions from "../../store/actions/index";
import { connect } from "react-redux";
import Spinner from "./../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

class Auth extends Component {
	state = {
		controls: {
			email: {
				elementType: "input",
				elementConfig: {
					type: "email",
					placeholder: "Mail Address"
				},
				value: "",
				validation: {
					required: true,
					isEmail: true
				},
				valid: false,
				touched: false
			},
			password: {
				elementType: "input",
				elementConfig: {
					type: "password",
					placeholder: "Password"
				},
				value: "",
				validation: {
					required: true,
					minLength: 6
				},
				valid: false,
				touched: false
			}
		},
		formIsValid: false,
		isSignUp: false
	};

	componentDidMount() {
		if (!this.props.building && this.props.authRedirectPath !== "/") {
			this.props.onSetAuthRedirectPath();
		}
	}

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

		if (rules.isEmail) {
			const pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
			isValid = pattern.test(value) && isValid;
		}

		return isValid;
	}

	changedHandler = (event, formElement) => {
		const updatedForm = { ...this.state.controls };
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
		this.setState({ controls: updatedForm, formIsValid: formIsValid });
	};

	onSubmitHandler = (event) => {
		event.preventDefault();
		this.props.onAuth(
			this.state.controls.email.value,
			this.state.controls.password.value,
			this.state.isSignUp
		);
	};

	signUpHandler = () => {
		this.setState((prevState) => {
			return { isSignUp: !prevState.isSignUp };
		});
	};
	render() {
		let fetchedArray = [];
		for (let key in this.state.controls) {
			fetchedArray.push({
				id: key,
				config: this.state.controls[key]
			});
		}
		let form = fetchedArray.map((formElement) => (
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
		));

		let formCollage = <Spinner />;

		if (!this.props.loading) formCollage = form;

		let errorMessage = null;

		if (this.props.error) errorMessage = <p>{this.props.error}</p>;

		let redirectAfterAuth = null;
		if (this.props.isAuth)
			redirectAfterAuth = <Redirect to={this.props.authRedirectPath} />;

		return (
			<div className={classes.Auth}>
				{redirectAfterAuth}
				{errorMessage}
				<form onSubmit={this.onSubmitHandler}>
					{formCollage}
					<Button btnType='Success' disabled={!this.state.formIsValid}>
						LOG IN
					</Button>
				</form>

				<Button btnType='Danger' clicked={this.signUpHandler}>
					SWITCH TO {this.state.isSignUp ? "SIGNIN" : "SIGNUP"}
				</Button>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		loading: state.auth.loading,
		error: state.auth.error,
		isAuth: state.auth.idToken !== null,
		building: state.burgerBuilder.building,
		authRedirectPath: state.auth.authRedirectPath,
		userId: state.auth.localId
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onAuth: (email, password, isSignUp) =>
			dispatch(actions.auth(email, password, isSignUp)),
		onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath())
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
