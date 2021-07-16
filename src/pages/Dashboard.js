import React, { useEffect, useMemo, useRef, useState } from 'react';
import Notebook from '../containers/Notebook';
import { useNotesStore } from '../store';
import SideBar from '../components/SideBar';
import { useMeasure } from 'react-use';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from 'bootstrap';
import { useParams } from 'react-router-dom';
import CreateModal from '../components/CreateModal';
import useNewNotebook from '../hooks/useNewNotebook';

const Dashboard = props => {
	const user = useAuth();
	let { notebook: NOTEBOOK, group: GROUP, id: ID } = useParams();
	const { notebooks, groups } = useNotesStore();
	const [ref, { width: WIDTH }] = useMeasure();
	const [modal, setShowModal] = useState(false);
	const { name, handleChange, handleSubmit } = useNewNotebook();
	const notebookRef = useRef();

	const currentId = useMemo(() => NOTEBOOK ?
		notebooks.find(notebook => notebook.name === NOTEBOOK).id :
		notebooks[0].id, [ID, NOTEBOOK]);

	const currentNotes = useMemo(() => NOTEBOOK ?
		notebooks.find(notebook => notebook.name === NOTEBOOK).notes :
		notebooks[0].notes, [ID, NOTEBOOK, notebooks]);

	useEffect(() => {
		setShowModal(new Modal(notebookRef.current));
	}, []);

	return (
		<div className='container-fluid fixed-container' ref={ref}>
			<CreateModal
				ref={notebookRef}
				type='notebook'
				name={name}
				onSubmit={(e) => {
					handleSubmit(e).then(name => {
						modal.hide();
						props.history.push(`/${name}`);
					}).catch((err) => console.error(err));
				}}
				onChange={handleChange}
			/>
			<SideBar width={WIDTH / 6} {...props} />
			{NOTEBOOK ?
				<Notebook
					notebookId={currentId}
					notebookName={NOTEBOOK}
					notes={currentNotes}
				/> : GROUP ?
					<Notebook
						notebookId={groups.find(group => group.name === GROUP).id}
						notebookName={GROUP}
						notes={groups.find(group => group.name === GROUP).notes}
					/> : (
						<div
							className='d-flex min-vh-100 flex-column justify-content-center align-items-center mx-auto py-3'>
							<div className='d-grid gap-2 d-md-block'>
								<button className='btn btn-info big-btn' onClick={() => modal.show()}>
									Create your first Notebook
								</button>
							</div>
						</div>
					)
			}
		</div>
	);
};

export default Dashboard;
