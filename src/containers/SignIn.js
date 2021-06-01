import React, { useEffect, useRef, useState } from "react";
import "../validation";
import { Link, useHistory } from "react-router-dom";
import { Modal } from "bootstrap";
import { loginUser } from "../firebase";
import { SignInSchema } from "../validation";
import { ErrorMessage, Formik } from "formik";

const SignIn = () => {
	const history = useHistory();
	const [modal, setModal] = useState(false);
	const [error, setError] = useState(null);
	const loginAlert = useRef();

	useEffect(() => {
		setModal(new Modal(loginAlert.current));
	}, []);

	const alertMessage = (
		<div className="modal show" ref={loginAlert} tabIndex="-1" aria-hidden="true">
			<div className="modal-dialog">
				<div className="alert alert-danger">
					<div className="modal-header">
						<h5 className="modal-title">Oops!</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div className="modal-body">
						{error}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="py-5 container d-flex flex-column align-items-center">
			{alertMessage}
			<h1 className="text-center pb-5">Sign in</h1>
			<div className="mx-5 w-25">
				<Formik
					initialValues={{
						emailAddress: "",
						password: ""
					}}
					validationSchema={SignInSchema}
					onSubmit={(values, actions) => {
						loginUser(values)
							.then(() => history.push("/home"))
							.catch(({ message }) => {
								console.error(message);
								setError(message);
								modal.show();
							});
					}}
				>
					{({ handleSubmit, handleChange, handleBlur, touched, errors }) => (
						<form onSubmit={handleSubmit}>
							<div className="form-floating mb-4">
								<input
									type="email"
									name="emailAddress"
									id="email-address"
									className={`form-control ${touched.emailAddress && errors.emailAddress && "is-invalid"}`}
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

							<div className="text-center">
								<button type="submit" className="btn btn-secondary mb-4 text-capitalize w-100">Login</button>
							</div>

							<div className="text-center mb-4">
								<p>or sign in with:</p>
								<button type="button" className="btn btn-secondary btn-floating mx-2">
									<i className="fab fa-facebook-f" />
								</button>

								<button type="button" className="btn btn-secondary btn-floating mx-2">
									<i className="fab fa-google" />
								</button>
							</div>
							<div className="text-center">
								<Link to="/forgot-password">Forgot Password?</Link>
							</div>
						</form>
					)}
				</Formik>
			</div>
		</div>
	);
};

export default SignIn;