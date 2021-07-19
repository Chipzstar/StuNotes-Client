const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { copyNotes, updateGroupNoteRefs } = require('./helpers');
const cors = require('cors')({ origin: true });

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: 'https://collaborative-notetaking-app-default-rtdb.europe-west1.firebasedatabase.app',
	storageBucket: 'collaborative-notetaking-app.appspot.com'
});

exports.sendInvite = functions.region("europe-west2").https.onCall(async ({ email, groupId }, context) => {
	try {
		let user = await admin.auth().getUserByEmail(email)

		let sourcePath = `root/${context.auth.uid}/groups`
		let destPath = `root/${user.uid}/groups`

		const sourceRef = admin.firestore().collection(sourcePath).doc(groupId);
		const destRef = admin.firestore().collection(destPath).doc(groupId);

		await sourceRef.update({
			members: admin.firestore.FieldValue.arrayUnion({
				id: user.uid,
				name: user.displayName,
				email: user.email
			})
		})

		const doc = await sourceRef.get()

		if (doc.exists) {
			//set the group inside the user's firestore
			await destRef
				.set({ ...doc.data() })
				.catch((error) => {
					console.error('Error creating document', `${destPath}/${groupId}`, JSON.stringify(error));
					throw new functions.https.HttpsError(
						'data-loss',
						'Data was not copied properly to the target collection, please try again.',
					);
				});
			//check if there any existing notes in group
			if (doc.data()['notes'].length) {
				// copy them over the the invited user
				let noteRefs = await copyNotes(doc.data()['notes'], user.uid)
				// update the references of the notes field with the correct UID paths
				await updateGroupNoteRefs(destRef, noteRefs)
			}
		}
		return user;
	} catch (err) {
		console.error("Error fetching user data", err)
		throw new functions.https.HttpsError("not-found", err.message)
	}
});
