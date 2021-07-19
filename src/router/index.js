import { Route, Switch } from 'react-router-dom';
import SignUp from '../pages/SignUp';
import SignIn from '../pages/SignIn';
import Landing from '../pages/Landing';
import ErrorPage from '../pages/ErrorPage';
import PrivateRoute from '../components/PrivateRoute';
import ForgotPassword from '../pages/ForgotPassword';
import Navbar from '../components/NavBar';
import Settings from '../pages/Settings';
import Dashboard from '../pages/Dashboard';

let routes = (
	<Switch>
		<Route exact path='/'>
			<Navbar />
			<Landing />
		</Route>
		<Route path='/login' render={(props) => (
			<>
				<Navbar {...props} />
				<SignIn {...props} />
			</>)}
		/>
		<Route path='/signup' render={(props) => (
			<>
				<Navbar {...props} />
				<SignUp {...props} />
			</>)}
		/>
		<Route path='/forgot-password'>
			<Navbar />
			<ForgotPassword />
		</Route>

		<PrivateRoute exact path='/notebooks/:notebook' component={Dashboard} />
		<PrivateRoute exact path='/notebooks/:notebook/:id' component={Dashboard} />
		<PrivateRoute exact path='/groups/:group' component={Dashboard} />
		<PrivateRoute exact path='/groups/:group/:id' component={Dashboard} />
		<PrivateRoute exact path='/trash/:id' component={Dashboard} />
		<PrivateRoute exact path='/settings' component={Settings} />
		<Route exact path='*' component={ErrorPage} />
	</Switch>
);

export default routes;