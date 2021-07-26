const admin = require('firebase-admin');
const functions = require('firebase-functions');
const { convertToDate } = require('./helpers');

exports.updateMemberNotes = functions.region("europe-west2").https.onCall(async ({ members, id, data }, context) => {
	const { uid } = context.auth;
	functions.logger.info(context, {
		structuredData: true
	})
	functions.logger.info(data, {
		structuredData: true
	})
	if ('comments' in data){
		data = convertToDate(data)
	}
	try {
		for (let member of members){
			if (member.id !== uid){
				console.log(`${member.id} -> + -> ${data}`)
				let ref = admin.firestore().doc(`root/${member.id}/notes/${id}`)
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