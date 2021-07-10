import React from 'react';
import { Dropdown } from 'react-bootstrap';
import defaultProfile from '../assets/images/default profile.png';
import { signOutUser } from '../firebase';
import Notes from '../assets/svg/document.svg';
import Trash from '../assets/svg/trash.svg';
import Team from '../assets/svg/team.svg';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';
import { Link } from 'react-router-dom';
import '../stylesheets/App.css';

const SideBar = () => {
	const user = useAuth();
	const { clearNotes } = useNotesStore()
	return (
		<div className='d-flex flex-column flex-shrink-0 align-items-center pt-2 text-dark'>
			<ul className='nav nav-pills flex-column mb-sm-auto mb-auto' id='menu'>
				<li className='nav-item mt-4'>
					<Link to="/home" className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Notes} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Notes</span>
					</Link>
				</li>
				<li className='nav-item mt-4'>
					<a href='#'
					   className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Team} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Teams</span>
					</a>
				</li>
				<li className='nav-item mt-4'>
					<a href='#'
					   className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Trash} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Trash</span>
					</a>
				</li>
			</ul>
			<div className='w-100 my-3'>
				<hr className='my-2 divider' />
				<Dropdown className='d-flex flex-column'>
					<Dropdown.Toggle
						drop="up"
						variant='link'
						size='sm'
						id='dropdown-basic'
						className='d-flex flex-column align-items-center bg'
					>
						<img src={defaultProfile} alt='profile' width={75} height={60}
						     className=' mt-3' />
						<span className='mx-1'>{user.displayName}</span>
					</Dropdown.Toggle>
					<Dropdown.Menu>
						<Dropdown.Item href='#/action-1'>Profile</Dropdown.Item>
						<Dropdown.Item href='#/action-2'>Settings</Dropdown.Item>
						<Dropdown.Item href='#/action-4' disabled>
							<hr className='dropdown-divider' />
						</Dropdown.Item>
						<Dropdown.Item onClick={() => signOutUser().then(() => clearNotes())}>Sign out</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		</div>
	);
};

export default SideBar;
