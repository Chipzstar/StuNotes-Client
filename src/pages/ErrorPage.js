import React, { Component } from 'react';
import '../stylesheets/App.css'
import PropTypes from 'prop-types';

class ErrorPage extends Component {
	render() {
		return (
			<div className="container-fluid d-flex text-center justify-content-center align-items-center my-auto mx-auto fixed-container">
				<span className="display-4 fw-bold align-self-center">404 NOT FOUND!</span>
			</div>
		);
	}
}

ErrorPage.propTypes = {};

export default ErrorPage;
