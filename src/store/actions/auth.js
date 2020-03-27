import * as actionTypes from "./actionTypes";
import axios from "axios";

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	};
};
export const authSuccess = (idToken, localId) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		idToken: idToken,
		localId: localId
	};
};
export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error: error
	};
};

export const logOut = () => {
	localStorage.removeItem("token");
	localStorage.removeItem("expirationTime");
	localStorage.removeItem("userId");
	return {
		type: actionTypes.AUTH_LOGOUT
	};
};

export const checkAuthTimeOut = (expirationTime) => {
	return (dispatch) => {
		setTimeout(() => {
			dispatch(logOut());
		}, expirationTime * 1000);
	};
};

export const auth = (email, password, isSignUp) => {
	return (dispatch) => {
		dispatch(authStart());
		const authData = {
			email: email,
			password: password,
			returnSecureToken: true
		};
		let url =
			"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDSJ1PqM2FgPk9X7t-F381lnPui5LgegcE";
		if (!isSignUp)
			url =
				"https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDSJ1PqM2FgPk9X7t-F381lnPui5LgegcE";
		axios
			.post(url, authData)
			.then((response) => {
				// console.log(response.data);
				const expirationTime = new Date(
					new Date().getTime() + response.data.expiresIn * 1000
				);
				localStorage.setItem("token", response.data.idToken);
				localStorage.setItem("userId", response.data.localId);
				localStorage.setItem("expirationTime", expirationTime);
				dispatch(authSuccess(response.data.idToken, response.data.localId));
				dispatch(checkAuthTimeOut(response.data.expiresIn));
			})
			.catch((err) => {
				// console.log(err.response.data.error.message);
				dispatch(authFail(err.response.data.error.message));
			});
	};
};

export const setAuthRedirectPath = (path) => {
	return {
		type: actionTypes.SET_AUTH_REDIRECT_PATH,
		path: path
	};
};

export const authCheckStatus = () => {
	return (dispatch) => {
		const token = localStorage.getItem("token");
		if (!token) {
			dispatch(logOut());
		} else {
			const expirationTime = new Date(localStorage.getItem("expirationTime"));
			if (expirationTime <= new Date()) {
				dispatch(logOut());
			} else {
				const userId = localStorage.getItem("userId");
				dispatch(authSuccess(token, userId));
				dispatch(
					checkAuthTimeOut(
						(expirationTime.getTime() - new Date().getTime()) / 1000
					)
				);
			}
		}
	};
};
