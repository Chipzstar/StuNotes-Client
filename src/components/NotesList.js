import React, { useCallback, useState } from 'react';
import { ReactComponent as Trash } from '../assets/svg/trash.svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useNotesStore } from '../store';
import { useParams } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { deleteNote } from '../firebase';
import '../stylesheets/App.css';

const NotesList = ({ uid, filteredNotes, onSelect }) => {
	let { id: docId } = useParams();
	const [showToast, setShow] = useState(false);
	const { removeNote } = useNotesStore(useCallback(state => state, [docId]));

	const activeDoc = classNames({
		'list-group-item': true,
		'list-group-item-action': true,
		'flex-column': true,
		'align-items-start': true,
		'active': true
	});

	const inactiveDoc = classNames({
		'text-dark': true,
		'list-group-item': true,
		'list-group-item-action': true,
		'flex-column': true,
		'align-items-start': true
	});

	const alertMessage = (
		<div className='modal fade show' id='deleteModal' data-bs-backdrop='static' tabIndex='-1' aria-hidden='true'>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title'>Hold Up!</h5>
						<button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
					</div>
					<div className='modal-body'>
						Are you sure you want to delete this note?
					</div>
					<div className='modal-footer'>
						<button type='button' className='btn bg-info text-black' data-bs-dismiss='modal'>No</button>
						<button type='button' className='btn bg-primary text-black fw-bold' data-bs-dismiss='modal'
						        onClick={async () => {
							        removeNote(docId);
							        await deleteNote(uid, docId);
							        setShow(true);
						        }}>Yes
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const toastConfirmation = (
		<ToastContainer position='bottom-end'>
			<Toast onClose={() => setShow(false)} show={showToast} delay={3000} autohide>
				<Toast.Header closeButton={false}>
					<img src={logo} width={50} height={50} className='rounded me-2' alt='' />
					<span>Note deleted!</span>
				</Toast.Header>
			</Toast>
		</ToastContainer>
	);

	return (
		<div className='list-group overflow-y-scroll max-container'>
			{alertMessage}
			{filteredNotes.map(({ id, title, description, author, createdAt }, index) => {
				//console.log("Doc", index, "=>", id)
				return id === docId ?
					(
						<a key={index} className={activeDoc}>
							<div className='d-flex w-100 justify-content-between'>
								<h5 className='mb-1'>{title}</h5>
								<small>{createdAt}</small>
							</div>
							<p className='mb-1'>{description}</p>
							<div className='d-flex flex-row justify-content-between'>
								<small>{author}</small>
								<div data-bs-toggle='modal' data-bs-target='#deleteModal' role='button'>
									<Trash width={25} height={25} fill={'white'} />
								</div>
							</div>
						</a>
					) : (
						<a key={index} className={inactiveDoc} onClick={() => {
							onSelect(id, title, author);
						}}>
							<div className='d-flex w-100 justify-content-between'>
								<h5 className='mb-1'>{title}</h5>
								<small>{createdAt}</small>
							</div>
							<p className='mb-1'>{description}</p>
							<small>{author}</small>
						</a>
					);
			})}
			{toastConfirmation}
		</div>
	);
};

NotesList.propTypes = {
	uid: PropTypes.string.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default NotesList;
