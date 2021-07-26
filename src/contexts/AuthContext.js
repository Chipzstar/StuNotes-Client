import React, { useContext, useEffect, useState } from 'react';
import firebase from '../firebase';

export const AuthContext = React.createContext(null);

export function useAuth() {
	return useContext(AuthContext);
}

const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = firebase.auth().onAuthStateChanged(user => {
			setCurrentUser(user);
			setLoading(false);
		});
		console.log('Current user:', currentUser);
		return () => unsubscribe();
	}, [currentUser]);

	return (
		<AuthContext.Provider value={currentUser}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

export default AuthProvider;
