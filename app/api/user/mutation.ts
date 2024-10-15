import { gql } from "@apollo/client";

export const CREATE_ACCOUNT_MUTATION = gql`
	mutation createAccount($email: String!, $password: String!) {
		createAccount(email: $email, password: $password) {
			success
			message
		}
	}
`;
export const LOGIN_MUTATION = gql`
	mutation login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			success
			token
			message
		}
	}
`;

export const EDIT_MUTATION = gql`
	mutation editProfile($password: String) {
		editProfile(password: $password) {
			success
			message
		}
	}
`;

export const RESET_PW_MUTATION = gql`
	mutation resetPassword($email: String!) {
		resetPassword(email: $email) {
			success
			message
		}
	}
`;

export const DELETE_ACCOUNT_MUTATION = gql`
	mutation deleteAccount($email: String!, $password: String!) {
		deleteAccount(email: $email, password: $password) {
			success
			message
		}
	}
`;
