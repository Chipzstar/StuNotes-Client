import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import * as Y from 'yjs';
import moment from 'moment';
import debounce from 'lodash.debounce';
//components
import NotesList from '../components/NotesList';
import NoteContainer from '../components/NoteContainer';
import SideBar from '../components/SideBar';
import DashboardNav from '../components/DashboardNav';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { AiOutlineSortAscending } from 'react-icons/ai';
import Calendar from 'react-calendar';
import { Modal } from 'bootstrap';
import logo from '../assets/images/logo.png';
//hooks
import { useYArray, useYDoc } from 'zustand-yjs';
import { useNotesStore, usePreferencesStore } from '../store';
import { createNote, createTag, deleteTag, updateNote } from '../firebase';
import { useMeasure } from 'react-use';
//styles
import '../stylesheets/App.css';
import 'react-calendar/dist/Calendar.css';

const connectDoc = (doc) => {
	console.log('connected to a provider with room', doc.guid);
	return () => console.log('disconnected', doc.guid);
};

const Dashboard = props => {
	const user = useAuth();
	let { id: ID } = useParams();
	const yDoc = useYDoc(user.uid, connectDoc);
	const yDocList = yDoc.getArray('notes');
	const { data, push } = useYArray(yDocList);

	const { notes, addNote, updateMetaInfo, addTag, removeTag } = useNotesStore();
	const { sidebarCollapsed } = usePreferencesStore();
	const [ref, { width: WIDTH }] = useMeasure();

	const [noteCount, setNoteCount] = useState(notes.length);
	const [filteredNotes, setFilteredNotes] = useState(notes);
	const [sortOrder, setSort] = useState('default');
	const [title, setTitle] = useState(notes.length ? notes[0].title : 'Untitled');
	const [author, setAuthor] = useState(user.displayName);
	const [noteId, setNoteId] = useState(notes.length ? notes[0].id : user.uid);
	const [tags, setTags] = useState(notes.length ? notes[0].tags : []);
	const [status, setStatus] = useState('All changes saved');
	const [date, setDate] = useState(new Date());
	const [modal, setShowModal] = useState(false);
	const calendarModal = useRef();

	const debouncedChangeHandler = useMemo(() => debounce((id, data) =>
		update(id, data).then(() => setStatus('All changes saved')), 2000), []);

	const debouncedSearch = useMemo(() => debounce(val =>
			setFilteredNotes(prevState => {
				return val.length === 0 ?
					notes : val.length >= 2 ?
						notes.filter(item => item.title.toLowerCase().includes(val.toLowerCase())) : prevState;
			}), 400),
		[]);

	useEffect(() => {
		setShowModal(new Modal(calendarModal.current));
		if (notes.length && ID === undefined) {
			console.log('OPENING FIRST NOTE');
			props.history.push(`/home/${noteId}`);
		}
		return () => debouncedChangeHandler.cancel();
	}, []);

	useEffect(() => {
		console.log(WIDTH);
	}, [WIDTH]);

	useEffect(() => {
		setNoteCount(notes.length);
		setFilteredNotes(notes);
	}, [notes]);

	async function createNewNote() {
		let id = uuidv4();
		setNoteId(id);
		setTitle('Untitled');
		addNote(id, 'Untitled', author);
		let newNote = new Y.Text();
		console.log(newNote);
		push([newNote]);
		await createNote(user.uid, id, 'Untitled', author);
		props.history.push(`/home/${id}`);
	}

	const handleSearch = (e) => {
		let { value } = e.target;
		debouncedSearch(value);
	};

	const toggleSort = () => {
		console.log('sorting...');
		if (sortOrder === 'desc') {
			setSort('asc');
			filteredNotes.sort((a, b) => a.title > b.title ? -1 : b.title > a.title ? 1 : 0);
		} else {
			setSort('desc');
			filteredNotes.sort((a, b) => a.title < b.title ? -1 : b.title < a.title ? 1 : 0);
		}
	};

	const handleDocSelection = (docId, title, author, tags) => {
		setNoteId(docId);
		setTitle(title);
		setAuthor(author);
		setTags(tags);
		props.history.push(`/home/${docId}`);
	};

	const handleTitle = (e) => {
		setStatus('Saving...');
		const { value } = e.target;
		setTitle(value);
		updateMetaInfo(noteId, { title: value });
		debouncedChangeHandler(noteId, { title: value });
	};

	const handleDescription = (id, data) => {
		setStatus('Saving...');
		debouncedChangeHandler(noteId, data);
	};

	const handleDateChange = (date) => {
		setDate(date);
		setFilteredNotes(prevState => notes.filter(item => moment(item.createdAt).isSameOrBefore(date)));
	};

	const handleNewTag = async (e) => {
		e.preventDefault();
		let { value } = e.target.elements[0];
		setTags(prevState => {
			addTag(noteId, value);
			createTag(user.uid, noteId, value);
			return [...prevState, value];
		});
	};

	const handleRemoveTag = async (tagName) => {
		setTags(prevState => {
			removeTag(noteId, tagName);
			deleteTag(user.uid, noteId, tagName);
			return prevState.filter(item => item !== tagName);
		});
	};

	async function update(id, data) {
		console.table({ ...data });
		let result = await updateNote(user.uid, id, data);
		console.log(result);
	}

	const calendarPicker = (
		<div className='modal fade show' ref={calendarModal} tabIndex='-1' aria-hidden='true'>
			<div className='modal-dialog modal-dialog-centered'>
				<div className='modal-content d-flex align-items-center justify-content-center bg-transparent border-0'>
					<div className='modal-body'>
						<Calendar onChange={handleDateChange} value={date} />
					</div>
				</div>
			</div>
		</div>
	);

	return (
		<div className='container-fluid fixed-container' ref={ref}>
			{calendarPicker}
			<div id='page-content-wrapper' className='row flex-nowrap'>
				<div
					className='offcanvas offcanvas-start'
					tabIndex='-1'
					id='offcanvasExample'
					data-bs-keyboard='false'
					data-bs-backdrop='false'
					aria-labelledby='offcanvasExampleLabel'
					style={{ width: WIDTH / 6}}
				>
					<div className='offcanvas-header'>
						<div className='d-flex align-items-center flex-grow-1'>
							<Link to='/'>
								<img src={logo} width={50} height={50} alt='' className='rounded-circle' />
							</Link>
							<h4 className='offcanvas-title ps-3' id='offcanvasExampleLabel'>StuNotes</h4>
						</div>
						<button type='button' className='btn-close text-reset' data-bs-dismiss='offcanvas'
						        aria-label='Close' />
					</div>
					<div className='d-flex justify-content-center offcanvas-body'>
						<SideBar />
					</div>
				</div>
				<div className='col-sm-4 col-md-2 col-xl-3 px-0 bg-light'>
					<div className='d-flex flex-column pt-2 text-dark min-vh-100'>
						<DashboardNav onSearch={handleSearch} newNote={createNewNote}
						              isCollapsed={sidebarCollapsed} />
						<div className='d-flex flex-row align-items-center justify-content-around px-3 py-3'>
							<div className='d-flex flex-grow-1 align-items-center'>
								<RiBookletLine size={25} className='me-3' />
								<span
									className='text-center text-capitalize lead font-weight-bold'>All Notes - {noteCount}</span>
							</div>
							<div className='d-flex flex-grow-0 align-items-center justify-content-center'>
								<div role='button' onClick={() => modal.show()}>
									<VscCalendar size={25} className='me-2' />
								</div>
								<div role='button' onClick={toggleSort}>
									<AiOutlineSortAscending size={25} />
								</div>
							</div>
						</div>
						<div className='d-flex flex-grow-1'>
							<NotesList uid={user.uid} filteredNotes={filteredNotes} onSelect={handleDocSelection} />
						</div>
					</div>
				</div>
				<div className='col py-3'>
					<NoteContainer
						uid={user.uid}
						noteId={noteId}
						status={status}
						author={author}
						title={title}
						tags={tags}
						onTitleChange={handleTitle}
						onDescriptionChange={handleDescription}
						onNewTag={handleNewTag}
						newNote={createNewNote}
						onRemoveTag={handleRemoveTag}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
