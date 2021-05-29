import "./stylesheets/App.css";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/NavBar";
import Landing from "./containers/Landing";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar/>
				<Landing/>
			</div>
		</Router>
	);
}

export default App;
