import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import SearchBar from './SearchBar';
import NewNoteBtn from './NewNoteBtn';
import PropTypes from 'prop-types';

const DashboardNav = ({newNote}) => {
	return (
		<div className='d-flex flex-row align-items-center px-2 py-3'>
			<IoMdMenu size={35} />
			<SearchBar />
			<NewNoteBtn newNote={newNote} />
		</div>
	);
};

DashboardNav.propTypes = {
	newNote: PropTypes.func.isRequired
}

export default DashboardNav;
