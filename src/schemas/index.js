export const noteSchema = {
	id: '',
	notebookId: '',
	createdAt: new Date(),
	author: '',
	description: '',
	title: 'Untitled',
	tags: []
};

export const notebookSchema = {
	id: '',
	author: '',
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