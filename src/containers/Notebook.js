import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useHistory, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import debounce from 'lodash/debounce';
//components
import NoteList from '../components/NoteList';
import NoteContainer from '../components/NoteContainer';
import NotebookNav from '../components/NotebookNav';
import CalendarPicker from '../modals/CalendarPicker';
import CreateNotebook from '../modals/CreateNotebook';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { GrGroup } from 'react-icons/gr';
import { AiOutlineSortAscending } from 'react-icons/ai';
import { Modal } from 'bootstrap';
import { TYPES } from '../constants';
//hooks
import { useNotesStore } from '../store';
import { store, updateMemberNotes, updateNote } from '../firebase';
import useCalendar from '../hooks/useCalendar';
import useNewNotebook from '../hooks/useNewNotebook';
import useNewGroup from '../hooks/useNewGroup';
//function
import { checkEquality, noteToFirestore, noteToJS } from '../functions';
//styles
import '../stylesheets/App.css';
import 'react-calendar/dist/Calendar.css';

const Notebook = ({ notebookId, notebookName, notes, type }) => {
	//hooks
	const user = useAuth();
	const history = useHistory();
	const { notebook: NOTEBOOK, id: ID, group: GROUP } = useParams();
	const {
		groups,
		updateNotebookNote,
		updateGroupNote,
		addTag,
		removeTag,
		addNotebookNote,
		addGroupNote,
		addComment
	} = useNotesStore();
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
	//memos
	const noteId = useMemo(() => ID ? ID : notes.length ? notes[0].id : user.uid, [ID, notes]);
	const members = useMemo(() => GROUP ? groups.find(group => group.name === GROUP).members : [], [groups, GROUP]);
	//state
	const [noteCount, setNoteCount] = useState(notes.length);
	const [filteredNotes, setFilteredNotes] = useState(notes);
	const [sortOrder, setSort] = useState('default');
	const [title, setTitle] = useState(ID ? notes.find(note => note.id === ID).title : notes.length ? notes[0].title : 'Untitled');
	const [author, setAuthor] = useState(ID ? notes.find(note => note.id === ID).author : user.displayName);
	const [tags, setTags] = useState(ID ? notes.find(note => note.id === ID).tags : notes.length ? notes[0].tags : []);
	const [comments, setComments] = useState(ID ? notes.find(note => note.id === ID).comments : notes.length ? notes[0].comments : []);
	const [status, setStatus] = useState('All changes saved');
	const [calendarModal, showCalendarModal] = useState(false);
	const [notebookModal, showNotebookModal] = useState(false);
	const [groupModal, showGroupModal] = useState(false);
	//refs
	const notebookRef = useRef();
	const groupRef = useRef();

	const debouncedChangeHandler = useMemo(() => debounce((id, data) =>
		update(id, data).then(() => setStatus('All changes saved')), 3000), []);

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
		setNoteCount(notes.length);
		setFilteredNotes(notes);
	}, [notes]);

	useEffect(() => {
		if (GROUP && ID) {
			const note = noteToFirestore(notes.find(note => note.id === ID));
			let ref = store.doc(`current/${ID}`);
			ref.onSnapshot(snapshot => {
				console.count('firing observer');
				if (!snapshot.exists) {
					ref.set({ ...note }).then(() => console.log('Note reference created!'));
				} else if (!checkEquality(snapshot, note)) {
					let data = noteToJS(snapshot.data());
					updateGroupNote(notebookId, noteId, data);
					console.log('zustand note updated');
				}
			});
		}
	}, [NOTEBOOK, GROUP, ID]);

	function filterNotesByDate(date) {
		setFilteredNotes(() => notes.filter(item => moment(item.createdAt).startOf('day').isSameOrBefore(date)));
	}

	async function createNewNote() {
		try {
			let id = uuidv4();
			setTitle('Untitled');
			if (NOTEBOOK) {
				await addNotebookNote(user.uid, notebookId, id, 'Untitled', author);
				history.push(`/notebooks/${notebookName}/${id}`);
			} else {
				await addGroupNote(user.uid, notebookId, id, 'Untitled', author);
				history.push(`/groups/${notebookName}/${id}`);
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

	const handleDocSelection = (id, title, author, tags, comments) => {
		setTitle(title);
		setAuthor(author);
		setTags(tags);
		setComments(comments);
		NOTEBOOK ?
			history.push(`/notebooks/${notebookName}/${id}`) :
			history.push(`/groups/${notebookName}/${id}`);
	};

	const handleTitle = (e, type) => {
		setStatus('Saving...');
		const { value } = e.target;
		setTitle(value);
		setFilteredNotes(() => notes.map(note => note.id === noteId ? { ...note, title: value } : note));
		type === TYPES.PERSONAL ? updateNotebookNote(noteId, { title: value }) : updateGroupNote(notebookId, noteId, { title: value });
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
			addTag(user.uid, notebookId, noteId, value);
			return [...prevState, value];
		});
	};

	const handleNewComment = async (e) => {
		e.preventDefault();
		let { value } = e.target;
		let comment = {
			createdAt: new Date(),
			author: user.displayName,
			comment: value,
			index: null,
			length: null
		};
		setComments(prevState => {
			prevState.forEach((c, index) => prevState[index]['createdAt'] = new Date(c.createdAt));
			let newComments = [...prevState, comment];
			addComment(user.uid, type, notebookId, noteId, comment);
			debouncedChangeHandler(noteId, { comments: newComments });
			return newComments;
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
		await updateNote(user.uid, type, id, data);
		if ('comments' in data) data.comments.forEach((c, index) => data.comments[index]['createdAt'] = c.createdAt.getTime());
		members.length > 1 && updateMemberNotes({ members, id, data })
			.then(res => console.log('member notes updated', res))
			.catch(err => console.error(err));
	}

	return (
		<div id='page-content-wrapper' className='row flex-nowrap'>
			<CalendarPicker date={date} onChangeHandler={handleDateChange} modalRef={calendarRef} />
			<CreateNotebook
				type={TYPES.PERSONAL}
				ref={notebookRef}
				name={newNotebookName}
				onChange={handleChangeNotebook}
				onSubmit={(e) => handleSubmitNotebook(e)
					.then(name => {
						notebookModal.hide();
						history.push(`/notebooks/${name}`);
					})
					.catch((err) => console.error(err))
				}
			/>
			<CreateNotebook
				type={TYPES.SHARED}
				ref={groupRef}
				name={newGroupName}
				onChange={handleChangeGroup}
				onSubmit={(e) => handleSubmitGroup(e)
					.then(name => {
						groupModal.hide();
						history.push(`/groups/${name}`);
					})
					.catch((err) => console.error(err))
				}
			/>
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
							{NOTEBOOK ? <RiBookletLine size={25} className='me-3' /> :
								<GrGroup size={25} className='me-3' />}
							<span className='text-center text-capitalize lead fw-bold'>
								{notebookName} - {noteCount}
							</span>
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
						<NoteList
							uid={user.uid}
							collectionId={notebookId}
							filteredData={filteredNotes}
							onSelect={handleDocSelection}
						/>
					</div>
				</div>
			</div>
			<div className='col py-3'>
				<NoteContainer
					type={type}
					notebookId={notebookId}
					notebookName={notebookName}
					noteId={noteId}
					status={status}
					author={author}
					title={title}
					tags={tags}
					comments={comments}
					members={members}
					onTitleChange={handleTitle}
					onDescriptionChange={handleDescription}
					onNewTag={handleNewTag}
					onNewNote={createNewNote}
					onRemoveTag={handleRemoveTag}
					onNewComment={handleNewComment}
				/>
			</div>
		</div>
	);
};

export default Notebook;
