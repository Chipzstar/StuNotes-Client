import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SideBar from '../components/SideBar';
import DashboardNav from '../components/DashboardNav';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { AiOutlineSortAscending } from 'react-icons/ai';
import document from '../assets/svg/document.svg';
import tag from '../assets/svg/price-tag.svg';
import share from '../assets/svg/share.svg';
import upload from '../assets/svg/cloud-upload.svg';
import NotesList from '../components/NotesList';
import TextEditContainer from '../components/TextEditContainer';
import '../stylesheets/App.css';

import io from 'socket.io-client';
const socket = io('localhost:8080');

const Dashboard = () => {
	const user = useAuth();
	const [countNotes, setCountNotes] = useState(0);
	const [author, setAuthor] = useState('Chisom');

	useEffect(() => {}, []);

	return (
		<div className='container-fluid fixed-container'>
			<div className='row flex-nowrap'>
				<div className='col-sm-2 col-md-1 col-xl-1 px-sm-2 px-0 bg-light'>
					<SideBar />
				</div>
				<div className='col-sm-4 col-md-4 col-xl-3 px-0 bg-light'>
					<div className='d-flex flex-column pt-2 text-dark min-vh-100'>
						<DashboardNav />
						<div className='d-flex flex-row align-items-center justify-content-around px-3 py-3'>
							<div className='d-flex flex-grow-1 align-items-center'>
								<RiBookletLine size={25} className='me-3' />
								<span
									className='text-center text-capitalize lead font-weight-bold'>All Notes - {countNotes}</span>
							</div>
							<div className='d-flex flex-grow-0 align-items-center justify-content-center'>
								<VscCalendar size={25} className='me-2' />
								<AiOutlineSortAscending size={25} />
							</div>
						</div>
						<div className='d-flex flex-grow-1'>
							<NotesList />
						</div>
					</div>
				</div>
				<div className='col py-3'>
					<div className='container-fluid flex-column text-center py-3'>
						<div className='d-flex flex-row align-items-center justify-content-between px-2 pb-3'>
							<div className='d-flex align-items-center'>
								<div className='d-flex flex-row align-items-center pe-5'>
									<img src={document} width={25} height={25} alt='' />
									<span className='lead font-weight-bold ps-3'>All Notes</span>
								</div>
								<div className='d-flex flex-row align-items-center'>
									<img src={tag} width={25} height={25} alt='' />
									<form>
										<input
											type='text'
											onSubmit={(e) => {
												e.preventDefault();
												console.log('Hello');
											}}
											placeholder='Add Tags'
											className='lead text-muted ps-3 border-0 tag-input'
										/>
									</form>
								</div>
							</div>
							<div>
								<div>
									<img src={share} width={25} height={25} alt='' className='me-3 icon-btn' />
									<img src={upload} width={25} height={25} alt='' className='icon-btn' />
								</div>
							</div>
						</div>
						<div className='d-flex flex-row align-items-center justify-content-between px-2 pt-2'>
							<div>
								<h1 className='font-weight-bold'>Databases</h1>
							</div>
							<div>
								<span>Author: <span className='font-weight-bold'>{author}</span></span>
							</div>
						</div>
						<hr className='border-2' />
						<div className="py-2">
							<TextEditContainer socket={socket}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
