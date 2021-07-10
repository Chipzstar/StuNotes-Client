import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import SearchBar from './SearchBar';
import NewNoteBtn from './NewNoteBtn';
import PropTypes from 'prop-types';

const DashboardNav = ({ onSearch, newNote }) => {
	return (
		<div className='d-flex flex-row align-items-center px-2 py-3'>
			<div
				id='sidebarToggle'
				role='button'
				data-bs-toggle='offcanvas'
				data-bs-target='#offcanvasExample'
				aria-controls='offcanvasExample'
			>
				<IoMdMenu size={35} />
			</div>
			<SearchBar onSearch={onSearch} />
			<NewNoteBtn newNote={newNote} />
		</div>
	);
};

DashboardNav.propTypes = {
	onSearch: PropTypes.func.isRequired,
	newNote: PropTypes.func.isRequired,
};

export default DashboardNav;
