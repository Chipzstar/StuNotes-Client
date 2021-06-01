import * as Yup from "yup";

export const SignUpSchema = Yup.object().shape({
	firstName: Yup.string()
		.max(20, "Must 20 characters or less")
		.required("first name is required"),
	lastName: Yup.string()
		.max(20, "Must 20 characters or less")
		.required("last name is required"),
	emailAddress: Yup.string()
		.email("Email is invalid")
		.required("email is required"),
	password: Yup.string()
		.min(6, "password must be at least 6 characters")
		.required("password is required"),
	confirmPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "Passwords must match!")
		.required("confirm password is required"),
	// termsOfService: Yup
	// 	.bool()
	// 	.oneOf([true], "Must Accept Terms and Conditions")
});

export const SignInSchema = Yup.object().shape({
	emailAddress: Yup.string()
		.email("Email is invalid")
		.required("email is required"),
	password: Yup.string()
		.min(6, "password must be at least 6 characters")
		.required("password is required"),
});