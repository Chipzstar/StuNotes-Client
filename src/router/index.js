import { Route, Switch } from "react-router-dom";
import SignUp from "../containers/SignUp";
import SignIn from "../containers/SignIn";
import Landing from "../containers/Landing";

let routes = (
	<Switch>
		<Route exact path="/">
			<Landing/>
		</Route>
		<Route exact path="/login">
			<SignIn />
		</Route>
		<Route path="/signup">
			<SignUp />
		</Route>
	</Switch>
);

export default routes;