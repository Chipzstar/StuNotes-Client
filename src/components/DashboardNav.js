import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import SearchBar from './SearchBar';
import NewNoteBtn from './NewNoteBtn';

const DashboardNav = () => {
	return (
		<div className='d-flex flex-row align-items-center px-2 py-3'>
			<IoMdMenu size={35} />
			<SearchBar />
			<NewNoteBtn />
		</div>
	);
};

export default DashboardNav;
