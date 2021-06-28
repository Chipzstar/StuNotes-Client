import "./stylesheets/App.css";
import { BrowserRouter as Router } from "react-router-dom";
// original file
import AuthProvider from "./contexts/AuthContext";
import routes from "./router";

function App() {
	return (
		<Router>
			<AuthProvider>
				<div className="app-container">
					{routes}
				</div>
			</AuthProvider>
		</Router>
	);
}

export default App;
