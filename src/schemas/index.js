export const notebookNoteSchema = {
	id: '',
	notebookId: '',
	groupId: null,
	createdAt: new Date(),
	author: '',
	description: '',
	title: 'Untitled',
	tags: [],
	comments: []
};

export const groupNoteSchema = {
	id: '',
	notebookId: null,
	groupId: '',
	createdAt: new Date(),
	author: '',
	description: '',
	title: 'Untitled',
	tags: [],
	comments: []
};

export const notebookSchema = {
	id: '',
	owner: '',
	name: '',
	createdAt: new Date(),
	notes: []
};

export const groupSchema = {
	id: '',
	createdAt: new Date(),
	owner: '',
	name: '',
	notes: [],
	members: []
};