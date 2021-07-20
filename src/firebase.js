import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/functions';

import { TYPES } from './constants';

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
export const store = app.firestore();
export const func = app.functions('europe-west2');

export const registerNewUser = async (userDetails) => {
	return new Promise(async (resolve, reject) => {
		const { firstName, emailAddress, password } = userDetails;
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

export const createNotebookNote = async (uid, notebookId, docId, title, author) => {
	return new Promise(async (resolve, reject) => {
		try {
			const noteRef = store.doc(`root/${uid}/notes/${docId}`);
			if (uid !== notebookId) {
				const notebookRef = store.doc(`root/${uid}/notebooks/${notebookId}`);
				await notebookRef.update({
					notes: firebase.firestore.FieldValue.arrayUnion(noteRef)
				});
			}
			await noteRef.set({
				title,
				author,
				notebookId,
				groupId: null,
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
			const Ref = store.collection(`root/${uid}/notes`);
			await Ref.doc(docId).update({
				...data
			});
			resolve('Note Updated!');
		} catch (err) {
			reject(err);
		}
	});
};

export const deleteNote = async (uid, type, collectionId, noteId) => {
	return new Promise(async (resolve, reject) => {
		try {
			console.table({uid, type, collectionId, noteId})
			const noteRef = store.doc(`root/${uid}/notes/${noteId}`);
			if (uid !== collectionId) {
				let path = type === TYPES.SHARED ? `root/${uid}/groups/${collectionId}` : `root/${uid}/notebooks/${collectionId}`
				const Ref = store.doc(path);
				await Ref.update({
					notes: firebase.firestore.FieldValue.arrayRemove(noteRef)
				});
				console.log(await Ref.get());
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
			const Ref = store.collection(`root/${uid}/notes`);
			const snapshot = await Ref.get();
			let notes = snapshot.docs.map(doc => {
				let { title, author, createdAt, description, tags, notebookId, groupId, comments } = doc.data();
				createdAt = createdAt.toDate();
				if (comments.length) comments.forEach((c, index) => comments[index] = {...c, createdAt: c.createdAt.toDate()})
				return { id: doc.id, title, author, createdAt, description, tags, notebookId, groupId, comments };
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
			const Ref = store.doc(`root/${uid}/notes/${docId}`);
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
			const Ref = store.doc(`root/${uid}/notes/${docId}`);
			await Ref.update({
				tags: firebase.firestore.FieldValue.arrayRemove(tag)
			});
			resolve('Tag removed');
		} catch (err) {
			reject(err);
		}
	});
};

export const createComment = async (uid, docId, comment) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = store.doc(`root/${uid}/notes/${docId}`);
			await Ref.update({
				comments: firebase.firestore.FieldValue.arrayUnion(comment)
			});
			resolve('New comment added');
		} catch (err) {
			reject(err);
		}
	});
};

export const fetchNotebooks = async (uid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = store.collection(`root/${uid}/notebooks`);
			const snapshot = await Ref.get();
			let notebooks = snapshot.docs.map(doc => {
				let { name, createdAt, owner } = doc.data();
				createdAt = createdAt.toDate();
				return { id: doc.id, name, owner, createdAt, notes: [] };
			});
			resolve(notebooks);
		} catch (err) {
			reject(err);
		}
	});
};

export const createNotebook = async (uid, id, name, owner) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = store.collection(`root/${uid}/notebooks`);
			await Ref.doc(id).set({
				name,
				owner,
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
			const Ref = store.collection(`root/${uid}/notebooks`);
			await Ref.doc(docId).update({
				...data
			});
			resolve('Notebook Updated!');
		} catch (err) {
			reject(err);
		}
	});
};

export const deleteNotebook = async (uid, docId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const notebookRef = store.doc(`root/${uid}/notebooks/${docId}`);
			const { notes } = (await notebookRef.get()).data();
			for (let ref of notes){
				await ref.delete()
			}
			await notebookRef.delete();
			resolve('Notebook Deleted!');
		} catch (err) {
			reject(err);
		}
	});
};

export const createGroup = async ({ uid, owner, email }, docId, name) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = store.doc(`root/${uid}/groups/${docId}`);
			await Ref.set({
				name,
				owner,
				createdAt: new Date(),
				notes: [],
				members: [{
					id: uid,
					name: owner,
					email
				}]
			});
			resolve();
		} catch (e) {
			console.error(e);
			reject(e);
		}
	});
};

export const deleteGroup = async (uid, docId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const groupRef = store.doc(`root/${uid}/groups/${docId}`);
			const { notes } = (await groupRef.get()).data();
			for (let ref of notes){
				await ref.delete()
			}
			await groupRef.delete();
			resolve('Group Deleted!');
		} catch (err) {
			reject(err);
		}
	});
};

export const createGroupNote = async (uid, groupId, docId, title, author) => {
	return new Promise(async (resolve, reject) => {
		try {
			const noteRef = store.doc(`root/${uid}/notes/${docId}`);
			if (uid !== groupId) {
				const groupRef = store.doc(`root/${uid}/groups/${groupId}`);
				await groupRef.update({
					notes: firebase.firestore.FieldValue.arrayUnion(noteRef)
				});
			}
			await noteRef.set({
				title,
				author,
				notebookId: null,
				groupId,
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

export const fetchGroups = async (uid) => {
	return new Promise(async (resolve, reject) => {
		try {
			const Ref = store.collection(`root/${uid}/groups`);
			const snapshot = await Ref.get();
			let groups = snapshot.docs.map(doc => {
				let { name, createdAt, owner, members } = doc.data();
				createdAt = createdAt.toDate();
				return { id: doc.id, name, owner, createdAt, notes: [], members };
			});
			resolve(groups);
		} catch (err) {
			reject(err);
		}
	});
}

export const sendInvite = func.httpsCallable('sendInvite')

export const updateMemberNotes = func.httpsCallable('updateMemberNotes')

export default app;