const admin = require('firebase-admin');
const cors = require('cors')({
	origin: true
});
const newMember = require('./newMember');
const updateMember = require('./updateMember');

admin.initializeApp({
	credential: admin.credential.applicationDefault(),
	databaseURL: 'https://collaborative-notetaking-app-default-rtdb.europe-west1.firebasedatabase.app',
	storageBucket: 'collaborative-notetaking-app.appspot.com'
});

exports.sendInvite = newMember.sendInvite;
exports.addMemberNotes = updateMember.addMemberNotes;
exports.updateMemberNotes = updateMember.updateMemberNotes;
exports.removeMemberNotes = updateMember.removeMemberNotes;
