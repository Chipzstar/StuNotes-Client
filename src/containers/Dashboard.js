import React from "react";
import "../stylesheets/App.css"
import { signOutUser } from "../firebase";
import { useHistory } from 'react-router-dom';

const Dashboard = () => {
	const history = useHistory()
	return (
		<div className="container text-center py-5">
			<p className="h1 py-4">Welcome to the Dashboard screen!</p>
			<button
				onClick={() => signOutUser().then(() => history.push("/"))}
				className="btn btn-lg btn-secondary logout px-4"
			>
				Sign Out
			</button>
		</div>
	);
};

export default Dashboard;
