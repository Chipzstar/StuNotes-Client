import React, { Component } from "react";
import logo from "../assets/images/logo.png";
import { NavLink } from "react-router-dom";
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
			<nav className="navbar navbar-expand-md navbar-expand-sm navbar-light nav-bg shadow">
				<div className="container-fluid">
					<NavLink to="/" className="navbar-brand" href="/">
						<img
							src={logo}
							alt="StuNotes"
							height={60}
							width={60}
							className="d-inline-block align-text-top mx-3"
						/>
						<div className="text-dark text-decoration-none">
							<h1>StuNotes</h1>
						</div>
					</NavLink>
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
					<div className="collapse navbar-collapse" id="navbarSupportedContent">
						{/*Left links*/}
						<ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex flex-row align-items-center">
							<li>
								<NavLink exact to="/login" className="nav-link px-3 me-2 text-decoration-none text-black">
									<span className="login-nav-link">Login</span>
								</NavLink>
							</li>
							<li>
								<NavLink exact to="/signup"
								         className="btn btn-secondary px-3 me-3 text-decoration-none text-black font-weight-bold">
									Sign up
								</NavLink>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		);
	}
}

export default Navbar;