import React, { useContext, useEffect, useState } from "react";
import firebase from "../firebase";
export const AuthContext = React.createContext(null)

export function useAuth() {
	return useContext(AuthContext);
}

const AuthProvider = ({children}) => {
	const [currentUser, setCurrentUser] = useState(null)

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged(user => setCurrentUser(user))
		console.log(currentUser)
		return unsubscribe
	}, [currentUser]);

	return (
		<AuthContext.Provider value={{ currentUser, setCurrentUser }}>
			{children}
		</AuthContext.Provider>

	);
};

export default AuthProvider;
