import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams, withRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import debounce from 'lodash.debounce';
//components
import NoteList from '../components/NoteList';
import NoteContainer from '../components/NoteContainer';
import NotebookNav from '../components/NotebookNav';
import CalendarPicker from '../components/CalendarPicker';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { AiOutlineSortAscending } from 'react-icons/ai';
import { Modal } from 'bootstrap';
//hooks
import { useNotesStore } from '../store';
import { updateNote } from '../firebase';
import useCalendar from '../hooks/useCalendar';
//styles
import '../stylesheets/App.css';
import 'react-calendar/dist/Calendar.css';
import useNewNotebook from '../hooks/useNewNotebook';
import CreateModal from '../components/CreateModal';
import useNewGroup from '../hooks/useNewGroup';
import { TYPES } from '../constants';

const Notebook = ({ notebookId, notebookName, notes, ...props }) => {
	//hooks
	const user = useAuth();
	const { notebook: NOTEBOOK, group: GROUP, id: ID } = useParams();
	const { updateNotebookNote, updateGroupNote, addTag, removeTag, addNotebookNote, addGroupNote } = useNotesStore();
	const [calendarRef, date, handleDateChange] = useCalendar(filterNotesByDate);
	const {
		name: newNotebookName,
		handleChange: handleChangeNotebook,
		handleSubmit: handleSubmitNotebook
	} = useNewNotebook();
	const {
		name: newGroupName,
		handleChange: handleChangeGroup,
		handleSubmit: handleSubmitGroup
	} = useNewGroup();
	//state
	const [noteCount, setNoteCount] = useState(notes.length);
	const [filteredNotes, setFilteredNotes] = useState(notes);
	const [sortOrder, setSort] = useState('default');
	const [title, setTitle] = useState(notes.length ? notes[0].title : 'Untitled');
	const [author, setAuthor] = useState(user.displayName);
	const [noteId, setNoteId] = useState(notes.length ? notes[0].id : user.uid);
	const [tags, setTags] = useState(notes.length ? notes[0].tags : []);
	const [status, setStatus] = useState('All changes saved');
	const [calendarModal, showCalendarModal] = useState(false);
	const [notebookModal, showNotebookModal] = useState(false);
	const [groupModal, showGroupModal] = useState(false);
	//refs
	const notebookRef = useRef();
	const groupRef = useRef();

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
		showCalendarModal(new Modal(calendarRef.current));
		showNotebookModal(new Modal(notebookRef.current));
		showGroupModal(new Modal(groupRef.current));
		return () => debouncedChangeHandler.cancel();
	}, []);

	useEffect(() => {
		console.table({ ID, NOTEBOOK, GROUP });
	}, [ID, NOTEBOOK, GROUP]);

	useEffect(() => {
		setNoteCount(notes.length);
		setFilteredNotes(notes);
	}, [notes]);

	function filterNotesByDate(date) {
		setFilteredNotes(prevState => notes.filter(item => moment(item.createdAt).startOf('day').isSameOrBefore(date)));
	}

	async function createNewNote() {
		try {
			let id = uuidv4();
			setNoteId(id);
			setTitle('Untitled');
			if (NOTEBOOK) {
				await addNotebookNote(user.uid, notebookId, id, 'Untitled', author)
				props.history.push(`/notebooks/${notebookName}/${id}`);
			} else {
				await addGroupNote(user.uid, notebookId, id, 'Untitled', author);
				props.history.push(`/groups/${notebookName}/${id}`);
			}
		} catch (e) {
			console.error(e);
		}
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

	const handleDocSelection = (id, title, author, tags) => {
		setNoteId(id);
		setTitle(title);
		setAuthor(author);
		setTags(tags);
		NOTEBOOK ?
			props.history.push(`/notebooks/${notebookName}/${id}`) :
			props.history.push(`/groups/${notebookName}/${id}`)
	};

	const handleTitle = (e, type) => {
		setStatus('Saving...');
		const { value } = e.target;
		setTitle(value);
		type === TYPES.PERSONAL ? updateNotebookNote(noteId, { title: value }) : updateGroupNote(notebookId, noteId, {title: value })
		debouncedChangeHandler(noteId, { title: value });
	};

	const handleDescription = (id, data) => {
		setStatus('Saving...');
		debouncedChangeHandler(noteId, data);
	};

	const handleNewTag = async (e) => {
		e.preventDefault();
		let { value } = e.target.elements[0];
		setTags(prevState => {
			addTag(user.uid, notebookName, noteId, value);
			return [...prevState, value];
		});
	};

	const handleRemoveTag = async (tagName) => {
		setTags(prevState => {
			removeTag(user.uid, notebookName, noteId, tagName);
			return prevState.filter(item => item !== tagName);
		});
	};

	async function update(id, data) {
		console.table({ ...data });
		let result = await updateNote(user.uid, id, data);
		console.log(result);
	}

	return (
		<div id='page-content-wrapper' className='row flex-nowrap'>
			<CalendarPicker date={date} onChangeHandler={handleDateChange} modalRef={calendarRef} />
			<CreateModal type={TYPES.PERSONAL} ref={notebookRef} name={newNotebookName} onChange={handleChangeNotebook} onSubmit={(e) => {
				handleSubmitNotebook(e).then(name => {
					notebookModal.hide();
					props.history.push(`/notebooks/${name}`);
				}).catch((err) => console.error(err));
			}} />
			<CreateModal type={TYPES.SHARED} ref={groupRef} name={newGroupName} onChange={handleChangeGroup} onSubmit={(e) => {
				handleSubmitGroup(e).then(name => {
					groupModal.hide();
					props.history.push(`/groups/${name}`);
				}).catch((err) => console.error(err));
			}} />
			<div className='col-sm-4 col-md-3 col-xl-3 bg-light'>
				<div className='d-flex flex-column pt-2 ps-2 text-dark min-vh-100'>
					<NotebookNav
						onSearch={handleSearch}
						onNewNote={createNewNote}
						onNewNotebook={() => notebookModal.show()}
						onNewGroupLibrary={() => groupModal.show()}
					/>
					<div className='d-flex flex-row align-items-center justify-content-around px-3 py-3'>
						<div className='d-flex flex-grow-1 align-items-center'>
							<RiBookletLine size={25} className='me-3' />
							<span
								className='text-center text-capitalize lead font-weight-bold'>{notebookName} - {noteCount}</span>
						</div>
						<div className='d-flex flex-grow-0 align-items-center justify-content-center'>
							<div role='button' onClick={() => calendarModal.show()}>
								<VscCalendar size={25} className='me-2' />
							</div>
							<div role='button' onClick={toggleSort}>
								<AiOutlineSortAscending size={25} />
							</div>
						</div>
					</div>
					<div className='d-flex flex-grow-1'>
						<NoteList uid={user.uid} filteredData={filteredNotes} onSelect={handleDocSelection} />
					</div>
				</div>
			</div>
			{/*TODO - add conditional rendering for notebooks and groups*/}

			<div className='col py-3'>
				<NoteContainer
					notebookName={notebookName}
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
	);
};

export default withRouter(Notebook);
