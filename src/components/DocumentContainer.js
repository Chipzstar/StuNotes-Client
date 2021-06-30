import React from 'react';
import PropTypes from 'prop-types';
import document from '../assets/svg/document.svg';
import tag from '../assets/svg/price-tag.svg';
import share from '../assets/svg/share.svg';
import upload from '../assets/svg/cloud-upload.svg';
import QuillEditor from './QuillEditor';

const DocumentContainer = ({onTitleChange, author, roomId, title}) => {
	return (
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
			<div className='d-flex flex-row align-items-center justify-content-between px-2 pt-2'>
				<div>
					<input
						name='title'
						type='text'
						defaultValue={title}
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
				<QuillEditor roomName={roomId} placeholder={'Write something here...'} theme={'snow'} />
				<div className='pt-4'>
					<button className='btn btn-lg btn-secondary text-capitalize'>Save</button>
				</div>
			</div>
		</div>
	);
}

DocumentContainer.propTypes = {
	onTitleChange: PropTypes.func.isRequired,
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	roomId: PropTypes.string.isRequired
};

export default DocumentContainer;
