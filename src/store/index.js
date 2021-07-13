import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { groupSchema, notebookSchema, noteSchema } from '../schemas';
import { createNotebook } from '../firebase';

let notesStore = (set, get) => ({
	allNotes: [],
	notebooks: [],
	addNote: (id, notebookId, title, author) => {
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
	},
	setNotes: (notes) => set(state => ({
		allNotes: notes,
		notebooks: []
	})),
	removeNote: (id) => set(state => {
		let targetIndex = state.allNotes.findIndex(item => item.id === id);
		return { allNotes: state.allNotes.filter((item, index) => index !== targetIndex) };
	}),
	clearNotes: () => set(state => ({
		allNotes: [],
		notebooks: []
	})),
	updateMetaInfo: (id, data) => set(state => ({
		allNotes: state.allNotes.map(item => item.id === id ? { ...item, ...data } : item),
		notebooks: []
	})),
	addTag: (id, tag) => set(state => ({
		allNotes: state.allNotes.map(item => item.id === id ? { ...item, tags: [...item.tags, tag] } : item),
		notebooks: []
	})),
	removeTag: (id, tag) => set(state => ({
		allNotes: state.allNotes.map(item => item.id === id ? {
			...item,
			tags: item.tags.filter(t => t !== tag)
		} : item),
		notebooks: []
	})),
	addNotebook: async (uid, id, name) => {
		await createNotebook(uid, id, name);
		set(state => ({
			allNotes: [...state.allNotes],
			notebooks: [...state.notebooks, {
				...notebookSchema,
				id,
				name
			}]
		}));
	},
	renameNotebook: (id, name) => set(state => ({
		allNotes: [...state.allNotes],
		notebooks: state.notebooks.map(item => item.id === id ? { ...item, name } : item)
	})),
	addNotebookNote: (notebookId, noteId, title, author) => set(state => {
		let note = {
			...noteSchema,
			id: noteId,
			notebookId,
			author,
			title,
			createdAt: new Date(),
		};
		return {
			allNotes: [...state.allNotes, note],
			notebooks: state.notebooks.map(item => item.id === notebookId ? { ...item, notes: [...item.notes, note] } : item)
		};
	})
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