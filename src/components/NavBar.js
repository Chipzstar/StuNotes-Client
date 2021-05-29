import React, { Component } from "react";
import logo from '../assets/images/logo.png';
import { BrowserRouter as Router } from "react-router-dom";
import "../stylesheets/App.css";

class Navbar extends Component {
	state = {
		isOpen: false
	};

	toggleCollapse = () => {
		this.setState({ isOpen: !this.state.isOpen });
	};

	render() {
		return (
			<Router>
				<nav className="navbar navbar-expand-md navbar-light nav-bg shadow">
					<div className="container-fluid">
						<a className="navbar-brand" href="#">
							<img
								src={logo}
								alt="StuNotes"
								height={60}
								width={60}
								className="d-inline-block align-text-top mx-3"
							/>
								<h1>StuNotes</h1>
							</a>
						<button
							className="navbar-toggler"
							type="button"
							data-bs-toggle="collapse"
							data-bs-target="#navbarSupportedContent"
							aria-controls="navbarSupportedContent"
							aria-expanded="false"
							aria-label="Toggle navigation"
						>
							<span className="navbar-toggler-icon" />
						</button>
						<div className="collapse navbar-collapse d-flex" id="navbarSupportedContent">
							{/*Left links*/}
							<ul className="navbar-nav ms-auto mb-2 mb-lg-0">
								<li>
									<a type="button" href="" className="btn btn-link px-3 me-2 text-decoration-none text-black">
										Login
									</a>
								</li>
								<li>
									<a type="button" href="" className="btn btn-link px-3 me-3 text-decoration-none text-black ">
										Sign up
									</a>
								</li>
							</ul>
						</div>
					</div>
				</nav>
			</Router>
		);
	}
}

export default Navbar;