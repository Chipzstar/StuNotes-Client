import React, { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import DashboardNav from '../components/DashboardNav';
import { VscCalendar } from 'react-icons/vsc';
import { RiBookletLine } from 'react-icons/ri';
import { AiOutlineSortAscending } from 'react-icons/ai';
import NotesList from '../components/NotesList';
import { useAuth } from '../contexts/AuthContext';
import '../stylesheets/App.css';
import DocumentContainer from '../components/DocumentContainer';
import documents from '../constants/Documents';

//import io from 'socket.io-client';
//const socket = io('localhost:8080');

const Dashboard = () => {
	const user = useAuth()
	const [countNotes, setCountNotes] = useState(0);
	const [title, setTitle] = useState('Untitled');
	const [author, setAuthor] = useState("");
	const [roomId, setRoomId] = useState("");

	const handleDocSelection = (title, author) => {
		setTitle(title)
		setAuthor(author)
	}

	const handleTitle = (e) => {
		const { name, value } = e.target;
		setTitle(value);
	};

	useEffect(() => {
		if (user) {
			setAuthor(user.displayName)
			setRoomId(user.uid)
		}
	}, []);

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
							<NotesList documents={documents} onSelect={handleDocSelection}/>
						</div>
					</div>
				</div>
				<div className='col py-3'>
					<DocumentContainer onTitleChange={handleTitle} author={author} roomId={roomId} title={title}/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
