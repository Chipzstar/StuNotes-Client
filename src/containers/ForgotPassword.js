import React, { useEffect, useRef, useState } from "react";
import { ErrorMessage, Formik } from "formik";
import { ForgotPasswordSchema } from "../validation";
import { resetPassword } from "../firebase";
import { Modal } from "bootstrap";

const ForgotPassword = () => {
	const [errorModal, setErrorModal] = useState(false);
	const [successModal, setSuccessModal] = useState(false);
	const [error, setError] = useState(null);
	const [message, setMessage] = useState("")
	const errorAlert = useRef();
	const successAlert = useRef();

	useEffect(() => {
		setSuccessModal(new Modal(successAlert.current));
		setErrorModal(new Modal(errorAlert.current));
	}, []);


	const successMessage = (
		<div className="modal show" ref={successAlert} tabIndex="-1" aria-hidden="true">
			<div className="modal-dialog modal-dialog-centered">
				<div className="alert alert-success">
					<div className="modal-header">
						<h5 className="modal-title">Success!</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
					</div>
					<div className="modal-body">
						{message}
					</div>
				</div>
			</div>
		</div>
	)

	const alertMessage = (
		<div className="modal show" ref={errorAlert} tabIndex="-1" aria-hidden="true">
			<div className="modal-dialog ">
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
		<div className="vertical-center pb-5">
			<div className="container d-flex flex-column align-items-center">
				{alertMessage}
				{successMessage}
				<h1 className="text-center pb-4">Recover Password</h1>
				<div className="mx-5 w-25">
					<Formik
						initialValues={{
							emailAddress: "",
						}}
						validationSchema={ForgotPasswordSchema}
						onSubmit={(values, actions) => {
							resetPassword(values.emailAddress)
								.then((msg) => {
									setMessage(msg);
									successModal.show();
								})
								.catch(({ message }) => {
									setError(message);
									errorModal.show();
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

								<div className="text-center">
									<button type="submit" className="btn btn-secondary mb-4 text-capitalize w-100">
										Send password reset email
									</button>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
};

export default ForgotPassword;
