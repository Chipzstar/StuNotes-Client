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

	const { id: currentId, notes: currentNotes } = useMemo(() => {
		console.table({
			ID,
			NOTEBOOK,
			GROUP,
			notebooks,
			groups
		})
		if (NOTEBOOK) {
			let { id, notes } = notebooks.find(notebook => notebook.name === NOTEBOOK)
			return { id, notes }
		} else if (GROUP) {
			let group = groups.find(group => group.name === GROUP)
			return group ? { id: group.id, notes: group.notes } : { id: notebooks[0].id, notes: notebooks[0].notes }
		} else {
			return { id: notebooks[0].id, notes: notebooks[0].notes}
		}
	}, [ID, NOTEBOOK, GROUP, notebooks, groups]);

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
						notebookId={currentId}
						notebookName={GROUP}
						notes={currentNotes}
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
