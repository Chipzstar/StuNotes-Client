import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let msgStore = (set) => ({
	msg: '',
	setMessage: (msg) => set(state => ({
		...state,
		msg
	}))
});

let documentStore = (set) => ({
	content: "",
	setContent: (content) => set(state => ({
		...state,
		content
	}))
})

let fileStore = (set) => ({
	files: [],
	addFile: (file) => set(state => ({
		files: [...state.files, file]
	}))
})

export const useMsgStore = create(
	persist(
		devtools(
			msgStore
		), {
			name: "messages"
		}
	)
);

export const useDocumentStore = create(
	persist(
		devtools(
			documentStore
		), {
			name: "documents"
		}
	)
)

export const useFilesStore = create(
	persist(
		devtools(
			fileStore
		), {
			name: "files"
		}
	)
)