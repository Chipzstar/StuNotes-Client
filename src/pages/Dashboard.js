import React, { useEffect, useRef, useState } from 'react';
import Notebook from '../containers/Notebook';
import { useNotesStore } from '../store';
import SideBar from '../components/SideBar';
import { useMeasure } from 'react-use';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from 'bootstrap';
import { useParams } from 'react-router-dom';
import NotebookModal from '../components/NotebookModal';
import useNewNotebook from '../hooks/useNewNotebook';

const Dashboard = props => {
	const user = useAuth();
	let { name: NAME } = useParams();
	const { notebooks } = useNotesStore();
	const [ref, { width: WIDTH }] = useMeasure();
	const [modal, setShowModal] = useState(false);
	const notebookRef = useRef();
	const { name, handleChange, handleSubmit } = useNewNotebook();

	useEffect(() => {
		if (notebooks.length && NAME === undefined) {
			console.log('OPENING FIRST NOTEBOOK');
			props.history.push(`/${name}`);
		}
		setShowModal(new Modal(notebookRef.current));
	}, []);

	useEffect(() => {
		console.log("URL NAME:", NAME)
	}, [NAME]);

	useEffect(() => {
		console.log("HOOK NAME:", name)
	}, [name]);

	return (
		<div className='container-fluid fixed-container' ref={ref}>
			<NotebookModal
				ref={notebookRef}
				name={name}
				onSubmit={(e) => {
					handleSubmit(e).then(name => {
						modal.hide();
						props.history.push(`/${name}`);
					}).catch((err) => console.error(err));
				}}
				onChange={handleChange}
			/>
			<SideBar width={WIDTH / 6} />
			{NAME && notebooks.some(item => item.name === NAME) ?
				<Notebook
					notebookId={notebooks.find(item => item.name === NAME).id}
					notebookName={NAME}
					notes={notebooks.find(item => item.name === NAME).notes}
				/> : (
					<div
						className='d-flex min-vh-100 flex-column justify-content-center align-items-center mx-auto py-3'>
						<div className='d-grid gap-2 d-md-block'>
							<button className='btn btn-info big-btn' onClick={() => modal.show()}>
								Create your first Notebook
							</button>
						</div>
					</div>
				)}
		</div>
	);
};

export default Dashboard;
