import React, { useEffect, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { ErrorMessage, Formik } from "formik";
import { SignUpSchema } from "../validation";
import "../stylesheets/App.css";
import { registerNewUser } from "../firebase";
import { useHistory } from 'react-router-dom';

const SignUp = () => {
	const history = useHistory();
	const [modal, setModal] = useState(false)
	const [error, setError] = useState(null)
	const myModal = useRef()

	useEffect(() => {
		setModal(new Modal(myModal.current))
	}, [])

	const alertMessage = (
		<div className="modal show" ref={myModal} tabIndex="-1" aria-hidden="true">
			<div className="modal-dialog">
				<div className="alert alert-danger">
					<div className="modal-header">
						<h5 className="modal-title">Oops!</h5>
						<button type="button" role="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
					</div>
					<div className="modal-body" role="alert">
						{error}
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className="py-5 container d-flex flex-column align-items-center">
			{alertMessage}
			<h1 className="text-center pb-4">Sign up</h1>
			<div className="mx-5">
				<Formik
					initialValues={{
						firstName: "",
						lastName: "",
						emailAddress: "",
						password: "",
						confirmPassword: "",
						termsOfService: false
					}}
					validationSchema={SignUpSchema}
					onSubmit={(values, actions) => {
						registerNewUser(values)
							.then(() => history.push("/home"))
							.catch(({message} ) => {
								console.error(message)
								setError(message)
								modal.show()
							})
					}}
				>
					{({ handleSubmit, handleChange, handleBlur, touched, errors }) => (
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
									type="checkbox"
									id="termsOfService"
									name="termsOfService"
									required
									className={`form-check-input me-2 ${touched.terms && errors.terms && "is-invalid"}`}
								/>
								<label className="form-check-label" htmlFor="termsOfService">
									Accept terms and conditions
								</label>
								<ErrorMessage
									name="termsOfService"
									render={msg => <span className="error">{msg}</span>}
								/>
							</div>
							<div className="d-flex flex-row justify-content-center">
								<div className="text-center mx-4">
									<button type="submit" className="btn btn-lg btn-secondary mb-4"><span
										className="text-capitalize">Sign up</span></button>
								</div>
								<div className="text-center mx-4">
									<button type="reset" className="btn btn-lg btn-warning mb-4"><span
										className="text-capitalize">Reset</span></button>
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