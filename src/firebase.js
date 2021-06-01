import firebase from "firebase/app";
import "firebase/auth";

const app = firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_APP_MEASUREMENT_ID
})

export const auth = app.auth()

export const registerNewUser = async (userDetails) => {
	return new Promise(async (resolve, reject) => {
		const { firstName, emailAddress, password, ...others } = userDetails
		try {
			await firebase.auth().createUserWithEmailAndPassword(emailAddress, password)
			await firebase.auth().currentUser.updateProfile({
				displayName: firstName
			})
			console.log(firebase.auth().currentUser)
			resolve(firebase.auth().currentUser)
		} catch (e) {
			reject(e)
		}
	})
}

export const signOutUser = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			await firebase.auth().signOut()
			resolve()
		} catch (e) {
			reject(e)
		}
	})
}

export default app;