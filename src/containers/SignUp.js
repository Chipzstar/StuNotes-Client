import React from "react";
import { ErrorMessage, Formik } from "formik";
import { SignupSchema } from "../validation/validate";
import "../stylesheets/App.css";

const SignUp = () => {

	// const handleSubmit = (event) => {
	// 	event.preventDefault();
	// }

	return (
		<div className="py-5 container d-flex flex-column align-items-center">
			<h1 className="text-center pb-4">Sign up</h1>
			<div className="mx-5">
				<Formik
					initialValues={{
						firstName: "",
						lastName: "",
						emailAddress: "",
						password: "hello",
						confirmPassword: ""
					}}
					validationSchema={SignupSchema}
					onSubmit={(values, actions) => {
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));
							actions.setSubmitting(false);
						}, 1000);
					}}
				>
					{({ values, handleSubmit, handleChange, handleBlur, touched, errors }) => (
						<form onSubmit={handleSubmit}>
							<div className="row mb-4">
								<div className="col">
									<div className="form-floating">
										<input
											type="text"
											name="firstName"
											id="first-name"
											className={`form-control ${touched.firstName && errors.firstName && "is-invalid"}`}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<ErrorMessage
											name="firstName"
											render={msg => <span className="error">{msg}</span>}
										/>
										<label className="form-label" htmlFor="first-name">First name</label>
									</div>
								</div>
								<div className="col">
									<div className="form-floating">
										<input
											type="text"
											name="lastName"
											id="lastname"
											className={`form-control ${touched.lastName && errors.lastName && "is-invalid"}`}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										<ErrorMessage
											name="lastName"
											render={msg => <span className="error">{msg}</span>}
										/>
										<label className="form-label" htmlFor="lastname">Last name</label>
									</div>
								</div>
							</div>

							<div className="form-floating mb-4">
								<input
									type="email"
									name="emailAddress"
									id="email-address"
									className={`form-control ${touched.emailAddress && errors.emailAddress && "is-invalid mb-4"}`}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<ErrorMessage
									name="emailAddress"
									render={msg => <span className="error">{msg}</span>}
								/>
								<label className="form-label" htmlFor="email-address">Email address</label>
							</div>

							<div className="form-floating mb-4">
								<input
									type="password"
									name="password"
									id="password"
									className={`form-control ${touched.password && errors.password && "is-invalid"}`}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<ErrorMessage
									name="password"
									render={msg => <span className="error">{msg}</span>}
								/>
								<label className="form-label" htmlFor="password">Password</label>
							</div>

							<div className="form-floating mb-4">
								<input
									type="password"
									id="confirm-password"
									name="confirmPassword"
									className={`form-control ${touched.confirmPassword && errors.confirmPassword && "is-invalid"}`}
									onChange={handleChange}
									onBlur={handleBlur}
								/>
								<ErrorMessage
									name="confirmPassword"
									render={msg => <span className="error">{msg}</span>}
								/>
								<label className="form-label" htmlFor="confirm-password">Confirm Password</label>
							</div>

							<div className="form-check d-flex justify-content-center mb-4">
								<input
									className="form-check-input me-2"
									type="checkbox"
									value=""
									id="t&c"
								/>
								<label className="form-check-label" htmlFor="t&c">
									Accept terms and conditions
								</label>
							</div>
							<div className="d-flex flex-row justify-content-center">
								<div className="text-center mx-4">
									<button type="submit" className="btn btn-lg btn-secondary mb-4"><span className="text-capitalize">Sign up</span></button>
								</div>
								<div className="text-center mx-4">
									<button type="reset" className="btn btn-lg btn-warning mb-4"><span className="text-capitalize">Reset</span></button>
								</div>
							</div>

							<div className="text-center">
								<p>or sign up with:</p>
								<button type="button" className="btn btn-secondary btn-floating mx-1">
									<i className="fab fa-facebook-f" />
								</button>
								<button className="btn btn-secondary mx-1 btn-floating" type="button">
									<i className="fab fa-google" />
								</button>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignUp;