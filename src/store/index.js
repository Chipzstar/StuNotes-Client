import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { groupNoteSchema, groupSchema, notebookNoteSchema, notebookSchema } from '../schemas';
import {
	createComment,
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
	sendInvite,
	updateNotebook
} from '../firebase';

let notesStore = (set, get) => ({
	notebooks: [],
	groups: [],
	createDefaultNotebook: (uid, owner) => set(state => ({
		notebooks: [...state.notebooks, {
			...notebookSchema,
			id: uid,
			owner,
			name: 'my notes',
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
			name: 'my notes',
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
			groups: state.groups.map(group => group.id === groupId ? {
				...group,
				notes: group.notes.map(note => note.id === noteId ? { ...note, ...data } : note)
			} : group)
		}));
	},
	addTag: async (uid, notebookId, id, tag) => {
		await createTag(uid, id, tag);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) =>
				index === 0 || notebook.id === notebookId ?
					{
						...notebook, notes: notebook.notes.map(note => note.id === id ?
							{
								...note,
								tags: [...note.tags, tag]
							} : note)
					} : notebook),
			groups: state.groups.map(group => group.id === notebookId ?
				{
					...group,
					notes: group.notes.map(note => note.id === id ?
						{
							...note,
							tags: [...note.tags, tag]
						} : note)
				} : group)
		}));
	},
	addComment: async (uid, notebookId, id, comment) => {
		let result = await createComment(uid, id, comment);
		console.log(result)
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) =>
				index === 0 || notebook.id === notebookId ?
					{
						...notebook, notes: notebook.notes.map(note => note.id === id ?
							{
								...note,
								comments: [...note.comments, comment]
							} : note)
					} : notebook),
			groups: state.groups.map(group => group.id === notebookId ?
				{
					...group,
					notes: group.notes.map(note => note.id === id ?
						{
							...note,
							comments: [...note.comments, comment]
						} : note)
				} : group)
		}));
	},
	removeTag: async (uid, notebookId, id, tag) => {
		await deleteTag(uid, id, tag);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 || notebook.id === notebookId ?
				{
					...notebook,
					notes: notebook.notes.map(note => note.id === id ?
						{
							...note,
							tags: note.tags.filter(t => t !== tag)
						} : note)
				} : notebook),
			groups: state.groups.map(group => group.id === notebookId ?
				{
					...group,
					notes: group.notes.map(note => note.id === id ?
						{
							...note,
							tags: note.tags.filter(t => t !== tag)
						} : note)
				} : group)
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
	removeNotebookNote: async (uid, type, notebookId, id) => {
		let result = await deleteNote(uid, type, notebookId, id);
		console.log(result);
		set(state => ({
			notebooks: state.notebooks.map((notebook, index) => index === 0 || notebook.id === notebookId ? {
				...notebook,
				notes: notebook.notes.filter(note => note.id !== id)
			} : notebook)
		}));
	},
	addGroup: async ({ uid, displayName: owner, email }, id, name) => {
		await createGroup({ uid, owner, email }, id, name);
		let group = {
			...groupSchema,
			id,
			name,
			owner,
			members: [{
				id: uid,
				name: owner,
				email
			}]
		};
		set(state => ({
			groups: [...state.groups, group]
		}));
		return group;
	},
	removeGroup: async (uid, id) => {
		let result = await deleteGroup(uid, id);
		console.log(result);
		set(state => ({
			groups: state.groups.filter(group => group.id !== id),
			notebooks: state.notebooks.map((notebook, index) => index === 0 ? {
				...notebook,
				notes: notebook.notes.filter(item => item.groupId !== id)
			} : notebook)
		}));
	},
	addGroupNote: async (uid, groupId, noteId, title, author) => {
		console.table({ groupId, noteId });
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
	removeGroupNote: async (uid, type, groupId, id) => {
		let result = await deleteNote(uid, type, groupId, id);
		console.log(result);
		set(state => ({
			groups: state.groups.map(group => group.id === groupId ? {
				...group,
				notes: group.notes.filter(note => note.id !== id)
			} : group)
		}));
	},
	addMember: async (groupName, email) => {
		let { id: groupId } = get().groups.find(group => group.name === groupName);
		try {
			let { data } = await sendInvite({ email, groupId });
			set(state => ({
				groups: state.groups.map(group => group.name === groupName ? {
					...group,
					members: [...group.members, { id: data.uid, name: data.displayName, email }]
				} : group)
			}));
			return `${data.displayName} has been added to the group!`;
		} catch (err) {
			return new Error('There is no user with that email address');
		}
	},
	clearAll: () => set(() => ({
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