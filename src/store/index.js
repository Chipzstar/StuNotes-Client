import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { groupNoteSchema, groupSchema, notebookNoteSchema, notebookSchema } from '../schemas';
import {
	createGroup,
	createGroupNote,
	createNotebook,
	createNotebookNote,
	createTag,
	deleteGroup,
	deleteNote,
	deleteNotebook,
	deleteTag,
	fetchGroups,
	fetchNotebooks,
	fetchNotes,
	updateNotebook
} from '../firebase';
import { TYPES } from '../constants';

let notesStore = (set, get) => ({
	notebooks: [],
	groups: [],
	createDefaultNotebook: (uid, owner) => set(state => ({
		notebooks: [...state.notebooks, {
			...notebookSchema,
			id: uid,
			owner,
			name: 'All Notes',
			createdAt: new Date(),
			notes: []
		}]
	})),
	setNotebooks: async (uid, owner, createdAt) => {
		let notebooks = await fetchNotebooks(uid);
		let groups = await fetchGroups(uid);
		let defaultNotebook = {
			...notebookSchema,
			id: uid,
			owner,
			name: 'My Notes',
			createdAt,
			notes: []
		};
		set(state => ({
			notebooks: [defaultNotebook, ...notebooks],
			groups: [...groups]
		}));
	},
	setNotes: async (uid) => {
		let allNotes = await fetchNotes(uid);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 ? {
				...notebook,
				notes: allNotes.filter(item => item.notebookId !== null)
			} : { ...notebook, notes: allNotes.filter(item => item.notebookId === notebook.id) }),
			groups: state.groups.map(group => ({
				...group,
				notes: allNotes.filter(item => item.groupId === group.id)
			}))
		}));
	},
	addNotebook: async (uid, id, name, owner) => {
		await createNotebook(uid, id, name, owner);
		let notebook = { ...notebookSchema, id, name, owner };
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
	updateNotebookNote: (noteId, data) => {
		let { notebookId } = get().notebooks[0].notes.find(item => item.id === noteId);
		set(state => ({
			notebooks: state.notebooks
				.map((notebook, index) => index === 0 || notebook.id === notebookId ? {
					...notebook,
					notes: notebook.notes.map(note => note.id === noteId ? { ...note, ...data } : note)
				} : notebook)
		}));
	},
	updateGroupNote: (groupId, noteId, data) => {
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 ? {
				...notebook,
				notes: notebook.notes.map(note => note.id === noteId ? { ...note, ...data } : note )
			} : notebook),
			groups: state.groups
				.map(group => group.id === groupId ? {
					...group,
					notes: group.notes.map(note => note.id === noteId ? { ...note, ...data } : note)
				} : group)
		}));
	},
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
		}));
	},
	removeTag: async (uid, notebookName, id, tag) => {
		await deleteTag(uid, id, tag);
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
		}));
	},
	addNotebookNote: async (uid, notebookId, noteId, title, author) => {
		await createNotebookNote(uid, notebookId, noteId, title, author);
		set(state => ({
			notebooks: state.notebooks.map((item, index) => index === 0 || item.id === notebookId ? {
				...item,
				notes: [...item.notes, {
					...notebookNoteSchema,
					id: noteId,
					notebookId,
					author,
					title,
					createdAt: new Date()
				}]
			} : item)
		}));
	},
	removeNote: async (uid, type, id) => {
		let note = get().notebooks[0].notes.find(item => item.id === id);
		let collectionId = type === TYPES.PERSONAL ? note.notebookId : note.groupId
		let result = await deleteNote(uid, type, collectionId, id);
		console.log(result);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 || notebook.id === collectionId ? {
				...notebook,
				notes: notebook.notes.filter(note => note.id !== id)
			} : notebook),
			groups: state.groups.map(group => group.id === collectionId ? {
				...group,
				notes: group.notes.filter(note => note.id === id)
			} : group)
		}));
	},
	addGroup: async (uid, id, name, owner) => {
		await createGroup(uid, id, name, owner);
		let group = { ...groupSchema, id, name, owner };
		set(state => ({
			groups: [...state.groups, group]
		}));
		return group;
	},
	removeGroup: async (uid, id) => {
		let result = await deleteGroup(uid, id)
		console.log(result)
		set(state => ({
			groups: state.groups.filter(group => group.id !== id),
			notebooks: state.notebooks.map((notebook, index) => index === 0 ? {
				...notebook,
				notes: notebook.notes.filter(item => item.groupId !== id)
			} : notebook)
		}));
	},
	addGroupNote: async (uid, groupId, noteId, title, author) => {
		let result = await createGroupNote(uid, groupId, noteId, title, author);
		console.log(result);
		set(state => ({
			groups: state.groups.map(item => item.id === groupId ? {
				...item,
				notes: [...item.notes, {
					...groupNoteSchema,
					id: noteId,
					groupId,
					author,
					title,
					createdAt: new Date()
				}]
			} : item)
		}));
	},
	clearAll: () => set(state => ({
		notebooks: [],
		groups: []
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

export const usePreferencesStore = create(
	persist(
		devtools(
			preferencesStore
		), {
			name: 'preferences'
		}
	)
);