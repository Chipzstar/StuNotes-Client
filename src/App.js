import "./stylesheets/App.css";
import { BrowserRouter as Router } from "react-router-dom";
// original file
import routes from "./router";
import Navbar from "./components/NavBar";
import AuthProvider from "./contexts/AuthContext";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar />
			</div>
			<AuthProvider>
				<div>
					{routes}
				</div>
			</AuthProvider>
		</Router>
	);
}

export default App;
