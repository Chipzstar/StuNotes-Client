import { Route, Switch } from "react-router-dom";
import SignUp from "../containers/SignUp";
import SignIn from "../containers/SignIn";
import Landing from "../containers/Landing";
import Dashboard from "../containers/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import ForgotPassword from "../containers/ForgotPassword";

let routes = (
	<Switch>
		<Route exact path="/" component={Landing}/>
		<Route path="/login" component={SignIn}/>
		<Route path="/signup" component={SignUp}/>
		<PrivateRoute exact path="/home" component={Dashboard}/>
		<Route path="/forgot-password" component={ForgotPassword}/>
	</Switch>
);

export default routes;