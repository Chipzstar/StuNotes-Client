import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import SearchBar from './SearchBar';
import PropTypes from 'prop-types';
import { Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { AiOutlinePlus } from 'react-icons/ai';

const NotebookNav = ({ onSearch, onNewNote, onNewNotebook }) => {
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
			<div className='px-3'>
				<SearchBar onSearch={onSearch} />
			</div>
			<div className='d-flex justify-content-center align-items-center'>
				<Dropdown as={ButtonGroup} drop="end" >
					<Button variant="info" onClick={onNewNote}>
						<div className='d-flex justify-content-center align-items-center add-btn'>
							<AiOutlinePlus size={25} className='' />
						</div>
					</Button>
					<Dropdown.Toggle split variant='info' id='dropdown-split-basic'>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item eventKey="1" onClick={onNewNote}>New Note</Dropdown.Item>
						<Dropdown.Item eventKey="2" onClick={onNewNotebook}>New Notebook</Dropdown.Item>
						<Dropdown.Item eventKey="3">New Team library</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
};

NotebookNav.propTypes = {
	onSearch: PropTypes.func.isRequired,
	onNewNote: PropTypes.func.isRequired,
	onNewNotebook: PropTypes.func.isRequired
};

export default NotebookNav;
