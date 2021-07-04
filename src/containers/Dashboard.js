import React, { useEffect, useState, useRef } from 'react';
import SideBar from '../components/SideBar';
import DashboardNav from '../components/DashboardNav';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { AiOutlineSortAscending } from 'react-icons/ai';
import NotesList from '../components/NotesList';
import { useAuth } from '../contexts/AuthContext';
import '../stylesheets/App.css';
import NoteContainer from '../components/NoteContainer';
import documents from '../constants/Documents';
import * as Y from 'yjs';
import { useYDoc, useYArray } from 'zustand-yjs';
import { useNotesStore } from '../store';
import { uuid } from 'uuidv4';
import { createNote } from '../firebase';

//refs
let quill = null
let binding = null
let wsProvider = null
let awareness = null

const connectDoc = (doc) => {
	console.log('connected to a provider with room', doc.guid)
	return () => console.log('disconnected', doc.guid)
}

const Dashboard = () => {
	const user = useAuth()

	const yDoc = useYDoc(user.uid, connectDoc);
	const yDocList = yDoc.getArray("notes")
	const { data, push } = useYArray(yDocList);
	const { notes, addNote, updateDeltas } = useNotesStore();
	const [noteCount, setNoteCount] = useState(0);
	const [title, setTitle] = useState('Untitled Note');
	const [author, setAuthor] = useState("unnamed");
	const [roomId, setRoomId] = useState(user.uid);

	useEffect(() => {
		console.log(user.uid)
	}, []);

	/*const bindEditor = (yText, room, doc) => {
		if (binding) {
			binding.destroy()
		}
		if (quill === null) {
			quill = new Quill(document.querySelector('#editor'), {
				modules: {
					cursors: true,
					toolbar: '#toolbar',
					history: {
						// Local undo shouldn't undo changes
						// from remote users
						userOnly: true
					}
				},
				placeholder: 'Write something here...',
				theme: 'snow' // 'bubble' is also great
			});
		}
		wsProvider = new WebsocketProvider('ws://localhost:1234', room, doc); // change to
		awareness = wsProvider.awareness
		binding = new QuillBinding(yText, quill, awareness)
	}*/

	const openNote = (index) => {
		let note = notes[index]
		console.log("Note:", note)
	}

	async function createNewNote() {
		let id = uuid()
		addNote(id, title, author)
		let newNote = new Y.Text()
		newNote.applyDelta([{ insert: `Document #${noteCount}` }, { insert: '\n', attributes: { header: 1 } }, { insert: '\n' }])
		console.log(newNote)
		push([newNote])
		updateDeltas(id, newNote.toDelta())
		await createNote(user.uid, id, title, author)
	}

	const handleSaveNote = () => {}

	const handleDocSelection = (docId, title, author) => {
		setRoomId(docId)
		setTitle(title)
		setAuthor(author)
	}

	const handleTitle = (e) => {
		const { value } = e.target;
		setTitle(value);
	};

	useEffect(() => {
		if (user) {
			setAuthor(user.displayName)
		}
	}, []);

	return (
		<div className='container-fluid fixed-container'>
			<div className='row flex-nowrap'>
				<div className='col-sm-2 col-md-1 col-xl-1 px-sm-2 px-0 bg-light'>
					<SideBar />
				</div>
				<div className='col-sm-4 col-md-4 col-xl-3 px-0 bg-light'>
					<div className='d-flex flex-column pt-2 text-dark min-vh-100'>
						<DashboardNav newNote={createNewNote}/>
						<div className='d-flex flex-row align-items-center justify-content-around px-3 py-3'>
							<div className='d-flex flex-grow-1 align-items-center'>
								<RiBookletLine size={25} className='me-3' />
								<span
									className='text-center text-capitalize lead font-weight-bold'>All Notes - {noteCount}</span>
							</div>
							<div className='d-flex flex-grow-0 align-items-center justify-content-center'>
								<VscCalendar size={25} className='me-2' />
								<AiOutlineSortAscending size={25} />
							</div>
						</div>
						<div className='d-flex flex-grow-1'>
							<NotesList documents={documents} onSelect={handleDocSelection} newIndex={notes.length - 1}/>
						</div>
					</div>
				</div>
				<div className='col py-3'>
					<NoteContainer
						author={author}
						roomId={roomId}
						title={title}
						onTitleChange={handleTitle}
						onSave={handleSaveNote}
						newNote={createNewNote}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
