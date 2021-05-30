import React, { Component } from "react";

class SignIn extends Component {
	render() {
		return (
			<div className="py-5 container d-flex flex-column align-items-center">
				<h1 className="text-center pb-4">Sign in</h1>
				<div className="mx-5">
					<form>
						<div className="form-floating mb-4">
							<input type="email" id="email-address" className="form-control" />
							<label className="form-label" htmlFor="email-address">Email address</label>
						</div>

						<div className="form-floating mb-4">
							<input type="password" id="password" className="form-control" />
							<label className="form-label" htmlFor="password">Password</label>
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
						<div className="text-center">
							<button type="submit" className="btn btn-secondary mb-4">Sign up</button>
						</div>

						<div className="text-center">
							<p>or sign up with:</p>
							<button type="button" className="btn btn-secondary btn-floating mx-1">
								<i className="fab fa-facebook-f"/>
							</button>

							<button type="button" className="btn btn-secondary btn-floating mx-1">
								<i className="fab fa-google"/>
							</button>
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default SignIn;