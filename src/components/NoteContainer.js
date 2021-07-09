import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import document from '../assets/svg/document.svg';
import priceTag from '../assets/svg/price-tag.svg';
import share from '../assets/svg/share.svg';
import upload from '../assets/svg/cloud-upload.svg';
import QuillEditor from './QuillEditor';
import { useNotesStore } from '../store';
import Tag from './Tag';

const NoteContainer = ({ status, author, noteId, title, tags, onTitleChange, onDescriptionChange, onNewTag, onRemoveTag, newNote }) => {
	const { notes } = useNotesStore(useCallback(state => state, [noteId]));
	const [tag, setTag] = useState('');

	const handleTag = useCallback(
		(e) => {
			let { value } = e.target;
			setTag(value);
		}, []);

	return (
		<div className='container-fluid flex-column text-center pb-3'>
			<div className='d-flex flex-row align-items-center justify-content-between px-2 pb-3'>
				<div className='d-flex align-items-center'>
					<div className='d-flex flex-row align-items-center pe-5'>
						<img src={document} width={25} height={25} alt='' />
						<span className='lead font-weight-bold ps-3'>All Notes</span>
					</div>
					<div className='d-flex flex-row align-items-center'>
						<img src={priceTag} width={25} height={25} alt='' />
						<form onSubmit={(event) => {
							onNewTag(event, tag)
							setTag("")
						}}>
							<input
								placeholder='Press enter to add tags'
								name='tag'
								type='text'
								className='lead text-muted ps-3 border-0 borderless'
								onChange={handleTag}
								value={tag}
								disabled={tags.length >= 5}
							/>
						</form>
					</div>
				</div>
				<div id="tag-container" className='d-flex flex-grow-1 flex-wrap mx-2'>
					<ul id="tags" className="d-flex flex-wrap mt-2">
						{tags.map((item, index) => <Tag key={index} name={item} remove={onRemoveTag}/>)}
					</ul>
				</div>
				<div>
					<div>
						<img src={share} width={25} height={25} alt='' className='me-3 icon-btn' />
						<img src={upload} width={25} height={25} alt='' className='icon-btn' />
					</div>
				</div>
			</div>
			{Object.keys(notes).length ? (
				<div className='d-flex flex-column'>
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
							<span className='text-muted font-italic'>{status}</span>
						</div>
						<div>
							<span>Author: <span className='font-weight-bold'>{author}</span></span>
						</div>
					</div>
					<hr className='border-2' />
					<div>
						<QuillEditor room={noteId} onChange={onDescriptionChange} />
					</div>
				</div>
			) : (
				<div className='d-flex min-vh-100 flex-column justify-content-center align-items-center mx-auto py-3'>
					<div className='d-grid gap-2 d-md-block'>
						<button className='btn btn-info big-btn' onClick={newNote}>
							Create your first note
						</button>
					</div>
					<div className='py-5'>
						<p className='text-muted display-6'>In future click the blue button at the top left to create
							new notes</p>
					</div>
				</div>
			)}
		</div>
	);
};

NoteContainer.propTypes = {
	noteId: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	tags: PropTypes.array.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onNewTag: PropTypes.func.isRequired,
	onRemoveTag: PropTypes.func.isRequired,
	newNote: PropTypes.func.isRequired
};

export default NoteContainer;
