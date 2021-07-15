import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const app = firebase.initializeApp({
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
	measurementId: process.env.REACT_APP_FIREBASE_APP_MEASUREMENT_ID
});

export const auth = app.auth();

export const registerNewUser = async (userDetails) => {
	return new Promise(async (resolve, reject) => {
		const { firstName, emailAddress, password, ...others } = userDetails;
		try {
			await firebase.auth().createUserWithEmailAndPassword(emailAddress, password);
			await firebase.auth().currentUser.updateProfile({
				displayName: firstName
			});
			console.log(firebase.auth().currentUser);
			resolve(firebase.auth().currentUser);
		} catch (e) {
			reject(e);
		}
	});
};

export const loginUser = async ({ emailAddress, password }) => {
	return new Promise(async (resolve, reject) => {
		try {
			await firebase.auth().signInWithEmailAndPassword(emailAddress, password);
			resolve(firebase.auth().currentUser);
		} catch (e) {
			reject(e);
		}
	});
};

export const resetPassword = async (email) => {
	return new Promise(async (resolve, reject) => {
		try {
			await firebase.auth().sendPasswordResetEmail(email);
			resolve(`A link to reset your password has been sent to the email ${email}. \nPlease check your inbox`);
		} catch (e) {
			reject(e);
		}
	});
};

export const signOutUser = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			await firebase.auth().signOut();
			resolve();
		} catch (e) {
			reject(e);
		}
	});
};

export const createNote = async (uid, notebookId, docId, title, author) => {
	return new Promise(async (resolve, reject) => {
		try {
			const noteRef = db.doc(`root/${uid}/notes/${docId}`);
			if (uid !== notebookId) {
				const notebookRef = db.doc(`root/${uid}/notebooks/${notebookId}`);
				await notebookRef.update({
					notes: firebase.firestore.FieldValue.arrayUnion(noteRef)
				});
			}
			await noteRef.set({
				title,
				author,
				notebookId,
				createdAt: new Date(),
				description: '',
				tags: []
			});
			resolve(`Note Created Successfully!`)
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
};

export const updateNote = async (uid, docId, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/notes`);
			await Ref.doc(docId).update({
				...data
			});
			resolve('Note Updated!');
		} catch (err) {
			reject(err);
		}
	});
};

export const deleteNote = async (uid, notebookId, noteId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const noteRef = db.doc(`root/${uid}/notes/${noteId}`);
			if (uid !== notebookId) {
				const notebookRef = db.doc(`root/${uid}/notebooks/${notebookId}`);
				await notebookRef.update({
					notes: firebase.firestore.FieldValue.arrayRemove(noteRef)
				});
				console.log(await notebookRef.get());
			}
			await noteRef.delete();
			resolve('Note Deleted Successfully!');
		} catch (err) {
			reject(err);
		}
	});
};

export const fetchNotes = async (uid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/notes`);
			const snapshot = await Ref.get();
			let notes = snapshot.docs.map(doc => {
				let { title, author, createdAt, description, tags, notebookId } = doc.data();
				createdAt = createdAt.toDate();
				return { id: doc.id, title, author, createdAt, description, tags, notebookId };
			});
			resolve(notes);
		} catch (err) {
			reject(err);
		}
	});
};

export const createTag = async (uid, docId, tag) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.doc(`root/${uid}/notes/${docId}`);
			await Ref.update({
				tags: firebase.firestore.FieldValue.arrayUnion(tag)
			});
			resolve('New tag added');
		} catch (err) {
			reject(err);
		}
	});
};

export const deleteTag = async (uid, docId, tag) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.doc(`root/${uid}/notes/${docId}`);
			await Ref.update({
				tags: firebase.firestore.FieldValue.arrayRemove(tag)
			});
			resolve('Tag removed');
		} catch (err) {
			reject(err);
		}
	});
};

export const fetchNotebooks = async (uid, author) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/notebooks`);
			const snapshot = await Ref.get();
			let notebooks = snapshot.docs.map(doc => {
				let { name, createdAt, notes } = doc.data();
				createdAt = createdAt.toDate();
				return { id: doc.id, name, author, createdAt, notes: [] };
			});
			resolve(notebooks);
		} catch (err) {
			reject(err);
		}
	});
};

export const createNotebook = async (uid, id, name, author) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/notebooks`);
			await Ref.doc(id).set({
				name,
				author,
				createdAt: new Date(),
				notes: []
			});
			resolve();
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
};

export const updateNotebook = async (uid, docId, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/notebooks`);
			await Ref.doc(docId).update({
				...data
			});
			resolve('Notebook Updated!');
		} catch (err) {
			reject(err);
		}
	});
};

export const deleteNotebook = async (uid, id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/notebooks`);
			await Ref.doc(id).delete();
			resolve('Note Deleted!');
		} catch (err) {
			reject(err);
		}
	});
};

export const createGroup = async (uid, id, name, owner) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = db.collection(`root/${uid}/groups`);
			await Ref.doc(id).set({
				name,
				owner,
				createdAt: new Date(),
				notes: [],
				members: []
			});
			resolve();
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
};

export const db = app.firestore();

export default app;