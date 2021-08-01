const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { formatComments, formatCreatedAt } = require('./helpers');

exports.addMemberNotes = functions
	.region('europe-west2')
	.https.onCall(async ({members, noteId, data}, context) => {
		const {uid} = context.auth;
		data = formatCreatedAt(data);
		try {
			for (const member of members) {
				if (member.id !== uid) {
					const noteRef = admin.firestore().doc(`root/${member.id}/notes/${noteId}`);
					const notebookRef = admin.firestore().doc(`root/${member.id}/groups/${data.groupId}`);
					await notebookRef.update({
						notes: admin.firestore.FieldValue.arrayUnion(noteRef)
					});
					await noteRef.set({
						...data
					});
				}
			}
		} catch (e) {
			throw new functions.https.HttpsError('unknown', e.message);
		}
		return 'DONE';
	});

exports.removeMemberNotes = functions
	.region('europe-west2')
	.https.onCall(async ({members, noteId, groupId}, context) => {
		const {uid} = context.auth;
		try {
			for (const member of members) {
				if (member.id !== uid) {
					const noteRef = admin.firestore().doc(`root/${member.id}/notes/${noteId}`);
					const notebookRef = admin.firestore().doc(`root/${member.id}/groups/${groupId}`);
					await notebookRef.update({
						notes: admin.firestore.FieldValue.arrayRemove(noteRef)
					});
					await noteRef.delete();
				}
			}
		} catch (e) {
			throw new functions.https.HttpsError('unknown', e.message);
		}
		return 'DONE';
	});

exports.updateMemberNotes = functions
	.region('europe-west2')
	.https.onCall(async ({members, id, data}, context) => {
		const {uid} = context.auth;
		functions.logger.info(context, {
			structuredData: true
		});
		functions.logger.info(data, {
			structuredData: true
		});
		if ('comments' in data) {
			data = formatComments(data);
		}
		try {
			for (const member of members) {
				if (member.id !== uid) {
					console.log(`${member.id} -> + -> ${data}`);
					const ref = admin.firestore().doc(`root/${member.id}/notes/${id}`);
					const snapshot = await ref.get();
					if (!snapshot.exists) {
						await ref.set({
							...data
						});
					} else {
						await ref.update({
							...data
						});
					}
				}
			}
		} catch (e) {
			return e;
		}
		return 'Done';
	});
