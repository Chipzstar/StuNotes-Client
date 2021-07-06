import React, { useCallback, useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import DashboardNav from '../components/DashboardNav';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { AiOutlineSortAscending } from 'react-icons/ai';
import NotesList from '../components/NotesList';
import { useAuth } from '../contexts/AuthContext';
import '../stylesheets/App.css';
import NoteContainer from '../components/NoteContainer';
import * as Y from 'yjs';
import { useYArray, useYDoc } from 'zustand-yjs';
import { useNotesStore } from '../store';
import { createNote, updateNote } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import debounce from 'lodash.debounce';

const connectDoc = (doc) => {
	console.log('connected to a provider with room', doc.guid)
	return () => console.log('disconnected', doc.guid)
}

const Dashboard = props => {
	const user = useAuth()
	const { id:ID } = useParams()
	const yDoc = useYDoc(user.uid, connectDoc);
	const yDocList = yDoc.getArray("notes");
	const { data, push } = useYArray(yDocList);
	const { notes, addNote, updateMetaInfo } = useNotesStore();
	const [noteCount, setNoteCount] = useState(notes.length);
	const [title, setTitle] = useState(notes.length ? notes[0].title : 'Untitled');
	const [author, setAuthor] = useState(user.displayName);
	const [noteId, setNoteId] = useState(notes.length ? notes[0].id : user.uid);
	const [status, setStatus] = useState("All changes saved");

	const debouncedChangeHandler = useCallback(debounce((id, data) => {
		console.log("debouncing...")
		update(id, data).then(() => setStatus("All changes saved"))
	}, 2000), []);

	useEffect(() => {
		console.count("Dashboard - ON")
		if (notes.length && ID === undefined) {
			console.count("OPENING FIRST NOTE")
			props.history.push(`/home/${noteId}`)
		}
	}, []);

	useEffect(() => {
		setNoteCount(notes.length)
	}, [notes]);

	async function createNewNote() {
		let id = uuidv4()
		setNoteId(id)
		setTitle("Untitled")
		addNote(id, "Untitled", author)
		let newNote = new Y.Text()
		console.log(newNote)
		push([newNote])
		await createNote(user.uid, id, "Untitled", author)
		setNoteCount(prevState => prevState + 1)
		props.history.push(`/home/${id}`)
	}

	const handleSaveNote = () => {}

	const handleDocSelection = (docId, title, author) => {
		setNoteId(docId)
		setTitle(title)
		setAuthor(author)
		props.history.push(`/home/${docId}`)
	}

	const handleTitle = (e) => {
		setStatus("Saving...")
		const { value } = e.target;
		setTitle(value);
		updateMetaInfo(noteId, {title: value})
		debouncedChangeHandler(noteId, {title: value})
	};

	async function update(id, data) {
		console.table({ ...data });
		let result = await updateNote(user.uid, id, data);
		console.log(result);
	}

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
							<NotesList uid={user.uid} onSelect={handleDocSelection}/>
						</div>
					</div>
				</div>
				<div className='col py-3'>
					<NoteContainer
						status={status}
						author={author}
						noteId={noteId}
						title={title}
						onTitleChange={handleTitle}
						onDescriptionChange={debouncedChangeHandler}
						onSave={handleSaveNote}
						newNote={createNewNote}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
