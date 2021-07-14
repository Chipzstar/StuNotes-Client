import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { groupSchema, notebookSchema, noteSchema } from '../schemas';
import { createNotebook, updateNotebook, deleteNotebook, fetchNotebooks, fetchNotes } from '../firebase';

let notesStore = (set, get) => ({
	allNotes: [],
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
			allNotes,
			notebooks: state.notebooks.map((notebook, index) => index === 0 ? {
				...notebook,
				notes: allNotes
			} : { ...notebook, notes: allNotes.filter(item => item.notebookId === notebook.id) })
		}));
	},
	addNotebook: async (uid, id, name, author) => {
		await createNotebook(uid, id, name, author);
		let notebook = { ...notebookSchema, id, name, author };
		set(state => ({
			allNotes: [...state.allNotes],
			notebooks: [...state.notebooks, notebook]
		}));
		return notebook;
	},
	removeNotebook: async (uid, id) => {
		let result = await deleteNotebook(uid, id);
		console.log(result);
		set(state => ({
			allNotes: state.allNotes.filter(item => item.notebookId !== id),
			notebooks: state.notebooks.filter(item => item.id !== id)
		}));
	},
	renameNotebook: async (uid, id, name) => {
		let result = await updateNotebook(uid, id, { name })
		console.log(result)
		set(state => ({
			allNotes: [...state.allNotes],
			notebooks: state.notebooks.map(item => item.id === id ? { ...item, name } : item)
		}))
	},
	clearNotes: () => set(state => ({
		allNotes: [],
		notebooks: []
	})),
	updateMetaInfo: (id, data) => set(state => ({
		allNotes: state.allNotes.map(item => item.id === id ? { ...item, ...data } : item),
		notebooks: [...state.notebooks]
	})),
	addTag: (id, tag) => set(state => ({
		allNotes: state.allNotes.map(item => item.id === id ? { ...item, tags: [...item.tags, tag] } : item),
		notebooks: [...state.notebooks]
	})),
	removeTag: (id, tag) => set(state => ({
		allNotes: state.allNotes.map(item => item.id === id ? {
			...item,
			tags: item.tags.filter(t => t !== tag)
		} : item),
		notebooks: []
	})),
	addNotebookNote: (notebookId, noteId, title, author) => set(state => {
		let note = {
			...noteSchema,
			id: noteId,
			notebookId,
			author,
			title,
			createdAt: new Date()
		};
		return {
			allNotes: [...state.allNotes, note],
			notebooks: state.notebooks.map(item => item.id === notebookId ? {
				...item,
				notes: [...item.notes, note]
			} : item)
		};
	}),
	removeNotebookNote: (id) => set(state => {
		let { notebookId } = state.allNotes.find(item => item.id === id);
		return {
			allNotes: state.allNotes.filter(item => item.id !== id),
			notebooks: state.notebooks.map(item => item.id === notebookId ? {
				...item,
				notes: item.notes.filter(item => item.id !== id)
			} : item)
		};
	}),
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