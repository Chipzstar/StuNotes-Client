import "./stylesheets/App.css";
import { BrowserRouter as Router } from "react-router-dom";
// original file
import routes from './router'
import Navbar from "./components/NavBar";

function App() {
	return (
		<Router>
			<div className="App">
				<Navbar/>
			</div>
			<div>
				{routes}
			</div>
		</Router>
	);
}

export default App;
