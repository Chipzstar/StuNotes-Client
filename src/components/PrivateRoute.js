import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function PrivateRoute({ component: Component, exact, strict, path, ...rest }) {
	const currentUser = useAuth();
	return (
		<Route
			exact={exact}
			strict={strict}
			path={path}
			render={props => currentUser ? <Component {...props} {...rest} /> : <Redirect to='/login' />
			}>
		</Route>
	);
}

export default PrivateRoute;
