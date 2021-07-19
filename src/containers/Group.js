import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useParams } from 'react-router-dom';
import * as Y from 'yjs';
import { useYArray, useYDoc } from 'zustand-yjs';
//components
import SideBar from '../components/SideBar';
import NotebookNav from '../components/NotebookNav';
import { RiBookletLine } from 'react-icons/ri';
import { VscCalendar } from 'react-icons/vsc';
import { AiOutlineSortAscending } from 'react-icons/ai';
import NoteList from '../components/NoteList';
import { useMeasure } from 'react-use';
import { Modal } from 'bootstrap';
import CalendarPicker from '../modals/CalendarPicker';
import useCalendar from '../hooks/useCalendar';
import moment from 'moment';
import { useGroupsStore } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { createGroup } from '../firebase';
import logo from '../assets/images/logo.png';
import useSort from '../hooks/useSort';
import { debounce } from 'lodash';
import useSearch from '../hooks/useSearch';
//stylesheets
import '../stylesheets/App.css';
import 'react-calendar/dist/Calendar.css';
import NoteContainer from '../components/NoteContainer';

const Group = props => {
	const user = useAuth();
	let { id: ID } = useParams();

	const debouncedSearch = useMemo(() => debounce(val =>
			setFilteredNotes(prevState => {
				return val.length === 0 ?
					groups[0].notes : val.length >= 2 ?
						groups[0].notes.filter(item => item.title.toLowerCase().includes(val.toLowerCase())) : prevState;
			}), 400),
		[]);

	function sortNotes(order){
		console.log(order)
		order === "asc" ?
			filteredNotes.sort((a, b) => a.title > b.title ? -1 : b.title > a.title ? 1 : 0) :
			filteredNotes.sort((a, b) => a.title < b.title ? -1 : b.title < a.title ? 1 : 0);
	}

	const calendarRef = useRef();
	//hooks
	const { groups, addGroup } = useGroupsStore();
	const [ref, { width: WIDTH }] = useMeasure();
	const [date, handleDateChange] = useCalendar(filterNotesByDate);
	const [handleSearch] = useSearch(debouncedSearch)
	const [toggleSort] = useSort(sortNotes);
	//states
	const [noteCount, setNoteCount] = useState(groups.length ? groups[0].notes.length : 0)
	const [modal, setShowModal] = useState(false);
	const [groupId, setGroupId] = useState(groups.length ? groups[0].id : user.uid)
	const [name, setName] = useState(groups.length ? groups[0].name : "")
	const [owner, setOwner] = useState(groups.length ? groups[0].owner : user.uid)
	const [members, setMembers] = useState(groups.length ? groups[0].members : [])
	const [filteredNotes, setFilteredNotes] = useState(groups.length ? groups[0].notes : []);

	useEffect(() => {
		setShowModal(new Modal(calendarRef.current));
	}, []);

	function filterNotesByDate() {
		setFilteredNotes(prevState => groups.notes.filter(item => moment(item.createdAt).isSameOrBefore(date)));
	}

	async function createNewGroup(name) {
		let id = uuidv4();
		setGroupId(id);
		setName(name);
		addGroup(id, name, owner);
		await createGroup(user.uid, id, name, owner);
		props.history.push(`/groups/${id}`);
	}

	const handleSelection = (id, name, owner, members) => {
		setGroupId(id);
		setName(name);
		setOwner(owner);
		setMembers(members);
		props.history.push(`/groups/${id}`);
	};

	return (
		<div className='container-fluid fixed-container' ref={ref}>
			<CalendarPicker date={date} onChangeHandler={handleDateChange} modalRef={calendarRef} />
			<div id='page-content-wrapper' className='row flex-nowrap'>
				<div
					className='offcanvas offcanvas-start'
					tabIndex='-1'
					id='offcanvasExample'
					data-bs-keyboard='false'
					data-bs-backdrop='false'
					aria-labelledby='offcanvasExampleLabel'
					style={{ width: WIDTH / 6 }}
				>
					<div className='offcanvas-header'>
						<div className='d-flex flex-column align-items-center flex-grow-1'>
							<Link to='/'>
								<img src={logo} width={50} height={50} alt='' className='rounded-circle' />
							</Link>
							<h4 className='offcanvas-title' id='offcanvasExampleLabel'>StuNotes</h4>
						</div>
						<button type='button' className='btn-close text-reset' data-bs-dismiss='offcanvas'
						        aria-label='Close' />
					</div>
					<div className='d-flex justify-content-center offcanvas-body'>
						<SideBar />
					</div>
				</div>
				<div className='col-sm-4 col-md-3 col-xl-3 bg-light'>
					<div className='d-flex flex-column pt-2 ps-2 text-dark min-vh-100'>
						<NotebookNav
							onSearch={handleSearch}
							onNew={createNewGroup}
						/>
						<div className='d-flex flex-row align-items-center justify-content-around px-3 py-3'>
							<div className='d-flex flex-grow-1 align-items-center'>
								<RiBookletLine size={25} className='me-3' />
								<span
										className='text-center text-capitalize lead font-weight-bold'>{name} - {noteCount}</span>
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
							<NoteList uid={user.uid} filteredData={filteredNotes} onSelect={handleSelection} />
						</div>
					</div>
				</div>
				<div className='col py-3'>
					
				</div>
			</div>
		</div>
	);
};

Group.propTypes = {};

export default Group;
