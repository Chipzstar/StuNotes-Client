const admin = require('firebase-admin');
const functions = require('firebase-functions');

exports.updateMemberNotes = functions.region("europe-west2").https.onCall(async ({ members, noteId, data }, context) => {
	const { uid } = context.auth;
	try {
		for (let member of members){
			if (member.id !== uid){
				let ref = admin.firestore().doc(`root/${member.id}/notes/${noteId}`)
				await ref.update({
					...data
				})
			}
		}
	} catch (e) {
		return e
	}
	return "Done"
});