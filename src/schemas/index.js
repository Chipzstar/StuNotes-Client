export const notebookNoteSchema = {
	id: '',
	notebookId: '',
	createdAt: new Date(),
	author: '',
	description: '',
	title: 'Untitled',
	tags: []
};

export const groupNoteSchema = {
	id: '',
	groupId: '',
	createdAt: new Date(),
	author: '',
	description: '',
	title: 'Untitled',
	tags: []
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