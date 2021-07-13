import { Route, Switch } from "react-router-dom";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import Landing from "../pages/Landing";
import ErrorPage from '../pages/ErrorPage';
import PrivateRoute from "../components/PrivateRoute";
import ForgotPassword from "../pages/ForgotPassword";
import Navbar from '../components/NavBar';
import Settings from '../pages/Settings';
import Groups from '../containers/Groups';
import Dashboard from '../pages/Dashboard';

let routes = (
	<Switch>
		<Route exact path="/" >
			<Navbar/>
			<Landing/>
		</Route>
		<Route path="/login" >
			<Navbar/>
			<SignIn/>
		</Route>
		<Route path="/signup">
			<Navbar/>
			<SignUp/>
		</Route>
		<Route path="/forgot-password">
			<Navbar/>
			<ForgotPassword/>
		</Route>
		<PrivateRoute exact path="/home" component={Dashboard}/>
		<PrivateRoute exact path="/:name" component={Dashboard}/>
		<PrivateRoute exact path="/:name/:id" component={Dashboard}/>
		<PrivateRoute exact path="/group" component={Dashboard}/>
		<PrivateRoute path="/group/:id" component={Dashboard}/>
		<PrivateRoute path="/group/:id/notebook" component={Groups}/>
		<PrivateRoute exact path="/settings" component={Settings}/>
		<Route exact path="*" component={ErrorPage}/>
	</Switch>
);

export default routes;