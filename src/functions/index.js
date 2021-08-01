import isEqual from 'lodash/isEqual';

export function checkEquality (snapshot, orig) {
	console.log(snapshot.data())
	let { comments, author, createdAt, notebookId, groupId, tags, title, description } = noteToJS(snapshot.data())
	let res = {
		id: snapshot.id,
		createdAt,
		author,
		notebookId,
		groupId,
		tags,
		comments,
		title,
		description,
	}
	/*console.log("firestore")
	console.table({ ...res })
	console.log("zustand")
	console.table({ ...orig })*/
	const isSame = isEqual(res, orig)
	console.log(isSame)
	return isSame
}

export function noteToJS(note){
	let comments = note.comments.map(c => ({ ...c, createdAt: c.createdAt.toDate() }))
	let createdAt = note.createdAt.toDate()
	return { ...note, createdAt, comments }
}

export function noteToFirestore(note){
	let comments = note.comments.map(c => ({ ...c, createdAt: new Date(c.createdAt)}))
	let createdAt = new Date(note.createdAt)
	return { ...note, comments, createdAt }
}

