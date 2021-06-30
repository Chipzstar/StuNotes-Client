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
import TextEditor from '../containers/TextEditor';

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
		<PrivateRoute exact path="/settings" component={Settings}/>
		<PrivateRoute exact path="/yjs" component={TextEditor} />
		<Route exact path="*" component={ErrorPage}/>
	</Switch>
);

export default routes;