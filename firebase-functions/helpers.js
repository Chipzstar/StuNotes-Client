const functions = require('firebase-functions');
const admin = require('firebase-admin');

async function copyNotes(data, uid) {
	const notesRef = admin.firestore().collection(`root/${uid}/notes`);
	const refs = [];
	for (const doc of data) {
		// get the note snapshot
		const snapshot = await doc.get();
		// copy the note to the user's firestore collection
		await notesRef.doc(snapshot.id).set({
			...snapshot.data()
		});
		refs.push(notesRef.doc(doc.id));
		functions.logger.info(snapshot.data(), {
			structuredData: true
		});
	}
	return refs;
}

async function updateGroupNoteRefs(dest, refs) {
	functions.logger.info(refs, {structuredData: true});
	await dest.update({
		notes: []
	});
	await refs.forEach((ref) => {
		dest.update({
			notes: admin.firestore.FieldValue.arrayUnion(ref)
		});
	});
	return null;
}

function formatComments(data) {
	const comments = data.comments.map((c) => ({...c, createdAt: new Date(c.createdAt)}));
	return {...data, comments};
}

function formatCreatedAt(data) {
	const createdAt = new Date(data.createdAt)
	return { ...data, createdAt }
}

module.exports = {
	copyNotes,
	updateGroupNoteRefs,
	formatComments,
	formatCreatedAt
};
