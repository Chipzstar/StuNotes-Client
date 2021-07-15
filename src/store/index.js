import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { groupSchema, notebookSchema, noteSchema } from '../schemas';
import {
	createNote,
	createNotebook,
	createTag,
	deleteNote,
	deleteNotebook,
	deleteTag,
	fetchNotebooks,
	fetchNotes,
	updateNotebook
} from '../firebase';

let notesStore = (set, get) => ({
	notebooks: [],
	/*addNote: (id, notebookId, title, author) => {
		let note = {
			...noteSchema,
			id,
			notebookId,
			author,
			title
		};
		set(state => ({
			allNotes: [...state.allNotes, note]
		}));
		return note;
	},*/
	createDefaultNotebook: (uid, author) => set(state => ({
		notebooks: [...state.notebooks, {
			...notebookSchema,
			id: uid,
			author,
			name: 'All Notes',
			createdAt: new Date(),
			notes: []
		}]
	})),
	setNotebooks: async (uid, author, createdAt) => {
		let notebooks = await fetchNotebooks(uid, author);
		let defaultNotebook = {
			...notebookSchema,
			id: uid,
			author,
			name: 'All Notes',
			createdAt,
			notes: []
		};
		set(state => ({
			notebooks: [defaultNotebook, ...notebooks]
		}));
	},
	setNotes: async (uid) => {
		let allNotes = await fetchNotes(uid);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 ? {
				...notebook,
				notes: allNotes
			} : { ...notebook, notes: allNotes.filter(item => item.notebookId === notebook.id) })
		}));
	},
	addNotebook: async (uid, id, name, author) => {
		await createNotebook(uid, id, name, author);
		let notebook = { ...notebookSchema, id, name, author };
		set(state => ({ notebooks: [...state.notebooks, notebook] }));
		return notebook;
	},
	removeNotebook: async (uid, id) => {
		let result = await deleteNotebook(uid, id);
		console.log(result);
		set(state => ({
			notebooks: state.notebooks
				.filter(item => item.id !== id)
				.map((item, index) => index === 0 ? {
					...item,
					notes: item.notes.filter(item => item.notebookId !== id)
				} : item)
		}));
	},
	renameNotebook: async (uid, id, name) => {
		let result = await updateNotebook(uid, id, { name });
		console.log(result);
		set(state => ({ notebooks: state.notebooks.map(item => item.id === id ? { ...item, name } : item) }));
	},
	clearNotes: () => set(state => ({
		notebooks: []
	})),
	updateMetaInfo: (notebookName, noteId, data) => set(state => ({
		notebooks: state.notebooks
			.map((notebook, index) => index === 0 || notebook.name === notebookName ? {
				...notebook,
				notes: notebook.notes.map(note => note.id === noteId ? { ...note, ...data } : note)
			} : notebook)
	})),
	addTag: async (uid, notebookName, id, tag) => {
		await createTag(uid, id, tag);
		set(state => ({
			notebooks: state.notebooks
				.map((notebook, index) => index === 0 || notebook.name === notebookName ?
					{
						...notebook, notes: notebook.notes.map(note => note.id === id ?
							{
								...note,
								tags: [...note.tags, tag]
							} : note)
					} : notebook)
		}))
	},
	removeTag: async (uid, notebookName, id, tag) => {
		await deleteTag(uid, id, tag)
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 || notebook.name === notebookName ?
				{
					...notebook,
					notes: notebook.notes.map(note => note.id === id ?
						{
							...note,
							tags: note.tags.filter(t => t !== tag)
						} : note)
				} : notebook)
		}))
	},
	addNotebookNote: async (uid, notebookId, noteId, title, author) => {
		let result = await createNote(uid, notebookId, noteId, title, author);
		console.log(result);
		set(state => ({
			notebooks: state.notebooks.map((item, index) => index === 0 || item.id === notebookId ? {
				...item,
				notes: [...item.notes, {
					...noteSchema,
					id: noteId,
					notebookId,
					author,
					title,
					createdAt: new Date()
				}]
			} : item)
		}));
	},
	removeNotebookNote: async (uid, id) => {
		let { notebookId } = get().notebooks[0].notes.find(item => item.id === id)
		let result = await deleteNote(uid, notebookId, id);
		console.log(result);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 || notebook.id === notebookId ? {
				...notebook,
				notes: notebook.notes.filter(note => note.id !== id)
			} : notebook)
		}));
	}
});

let groupsStore = (set) => ({
	groups: [],
	addGroup: (id, name, owner) => set(state => ({
		groups: [...state.groups, {
			...groupSchema,
			id,
			name,
			owner
		}]
	}))
});

let preferencesStore = (set) => ({
	sidebarCollapsed: true,
	toggleSidebarMode: () => set(state => ({
		sidebarCollapsed: !state.sidebarCollapsed
	}))
});

export const useNotesStore = create(
	persist(
		devtools(
			notesStore
		), {
			name: 'notes'
		}
	)
);

export const useGroupsStore = create(
	persist(
		devtools(
			groupsStore
		), {
			name: 'groups'
		}
	)
);

export const usePreferencesStore = create(
	persist(
		devtools(
			preferencesStore
		), {
			name: 'preferences'
		}
	)
);