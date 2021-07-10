import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { noteSchema } from '../schemas';

let notesStore = (set, get) => ({
	notes: [],
	addNote: (id, title, author) => set(state => ({
		notes: [...state.notes, {
			...noteSchema,
			id,
			author,
			title
		}]
	})),
	setNotes: (notes) => set(state => {
		return { notes }
	}),
	removeNote: (id) => set(state => {
		let targetIndex = state.notes.findIndex(item => item.id === id);
		return { notes: state.notes.filter((item, index) => index !== targetIndex) };
	}),
	clearNotes: () => set(state => ({
		notes: []
	})),
	updateMetaInfo: (id, data) => set(state => ({
		notes: state.notes.map(item => item.id === id ? { ...item, ...data } : item)
	})),
	addTag: (id, tag) => set(state => ({
		notes: state.notes.map(item => item.id === id ? { ...item, tags: [...item.tags, tag] } : item)
	})),
	removeTag: (id, tag) => set(state => ({
		notes: state.notes.map(item => item.id === id ? { ...item, tags: item.tags.filter(t => t !== tag) } : item)
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