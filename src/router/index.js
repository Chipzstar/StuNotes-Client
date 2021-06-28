import { Route, Switch } from "react-router-dom";
import SignUp from "../containers/SignUp";
import SignIn from "../containers/SignIn";
import Landing from "../containers/Landing";
import Dashboard from "../containers/Dashboard";
import ErrorPage from '../containers/ErrorPage';
import PrivateRoute from "../components/PrivateRoute";
import ForgotPassword from "../containers/ForgotPassword";
import Navbar from '../components/NavBar';
import Settings from '../containers/Settings';
import AuthRoute from '../components/AuthRoute';
import TextEditor from '../containers/TextEditor';

let routes = (
	<Switch>
		<AuthRoute exact path="/" >
			<Navbar/>
			<Landing/>
		</AuthRoute>
		<AuthRoute path="/login" >
			<Navbar/>
			<SignIn/>
		</AuthRoute>
		<AuthRoute path="/signup">
			<Navbar/>
			<SignUp/>
		</AuthRoute>
		<AuthRoute path="/forgot-password">
			<Navbar/>
			<ForgotPassword/>
		</AuthRoute>
		<PrivateRoute exact path="/home" component={Dashboard}/>
		<PrivateRoute exact path="/settings" component={Settings}/>
		<PrivateRoute exact path="/yjs" component={TextEditor} />
		<Route exact path="*" component={ErrorPage}/>
	</Switch>
);

export default routes;