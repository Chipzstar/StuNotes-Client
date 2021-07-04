import React from 'react';
import PropTypes from 'prop-types';
import document from '../assets/svg/document.svg';
import tag from '../assets/svg/price-tag.svg';
import share from '../assets/svg/share.svg';
import upload from '../assets/svg/cloud-upload.svg';
import QuillEditor from './QuillEditor';
import { useNotesStore } from '../store';

const NoteContainer = ({ author, roomId, title, onTitleChange, newNote }) => {
	const { notes } = useNotesStore()

	return (
		<div className='container-fluid flex-column text-center pb-3'>
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
								name='tag'
								type='text'
								onSubmit={(e) => {
									e.preventDefault();
									console.log('Hello');
								}}
								placeholder='Add Tags'
								className='lead text-muted ps-3 border-0 borderless'
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
			{Object.keys(notes).length ? (
				<div className="d-flex flex-column">
					<div className='d-flex flex-row align-items-center justify-content-between px-2 pt-2'>
						{/*TODO - check styling*/}
						<div>
							<input
								name='title'
								type='text'
								value={title}
								onChange={onTitleChange}
								placeholder='Untitled'
								className='h1 fw-bold border-0 borderless'
							/>
						</div>
						<div>
							<span>Author: <span className='font-weight-bold'>{author}</span></span>
						</div>
					</div>
					<hr className='border-2' />
					<div>
						<QuillEditor room={roomId}/>
					</div>
				</div>
			) : (
				<div className='d-flex min-vh-100 flex-column justify-content-center align-items-center mx-auto py-3'>
					<div className="d-grid gap-2 d-md-block">
						<button className='btn btn-info big-btn' onClick={newNote}>
							Create your first note
						</button>
					</div>
					<div className='py-5'>
						<p className="text-muted display-6">In future click the blue button at the top left to create new notes</p>
					</div>
				</div>
			)}
		</div>
	);
};

NoteContainer.propTypes = {
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	roomId: PropTypes.string.isRequired,
	onSave: PropTypes.func.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	newNote: PropTypes.func.isRequired
};

export default NoteContainer;
