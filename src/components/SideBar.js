import React from 'react';
import { Dropdown } from 'react-bootstrap-v5';
import defaultProfile from '../assets/images/default profile.png';
import { signOutUser } from '../firebase';
import Notes from '../assets/svg/document.svg';
import Trash from '../assets/svg/trash.svg';
import Team from '../assets/svg/team.svg';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';
import '../stylesheets/App.css';

const SideBar = () => {
	const user = useAuth();
	const { clearNotes } = useNotesStore()
	return (
		<div className='d-flex flex-column align-items-center px-3 pt-2 text-white min-vh-100'>
			<Dropdown className='d-flex flex-column align-items-center pb-4'>
				<Dropdown.Toggle
					variant='link'
					size='sm'
					id='dropdown-basic'
					className='d-flex flex-column align-items-center bg'
				>
					<img src={defaultProfile} alt='profile' width={75} height={60}
					     className=' mt-3' />
					<span className='d-none mx-1'>{user.email}</span>
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
			<ul className='nav nav-pills flex-column mb-sm-auto mb-0 align-items-center'
			    id='menu'>
				<li className='nav-item mt-4'>
					<a href='#' className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Notes} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Notes</span>
					</a>
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
			<div className='w-100 my-4'>
				<hr className='py-2 divider' />
				<div className='nav-link align-middle px-0 d-flex flex-row justify-content-center text-decoration-none'>
					<span className='text-capitalize h5' role="button" onClick={() => {
						signOutUser().then(() => clearNotes())
					}}>Sign Out</span>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
