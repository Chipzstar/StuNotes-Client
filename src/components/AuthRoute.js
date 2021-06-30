import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function AuthRoute({ component: Component, exact, strict, path, ...rest }) {
	const currentUser = useAuth()
	console.log(currentUser)
	return (
		<Route
			exact={exact}
			strict={strict}
			path={path}
			render={props => currentUser ? <Redirect to='/home' /> : <Component {...props} {...rest} />
			}>
		</Route>
	);
}

export default AuthRoute;
