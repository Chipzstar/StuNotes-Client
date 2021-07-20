import React from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

const CommentsContainer = ({ comments, submit }) => {
	return (
		<div className='d-flex flex-grow-1 flex-column justify-content-between'>
			<ul className='list-group'>
				{comments.map(({ comment, author, createdAt }) => (
					<li className='list-group-item rounded-5 border-0'>
						<Comment comment={comment} author={author} createdAt={createdAt} />
					</li>
				))}
			</ul>
			<div className='d-flex justify-content-center'>
				<div>
					<hr className='border border-2' />
				</div>
				<textarea
					onKeyPress={e => e.key === 'Enter' && submit(e)}
					className='form-control'
					placeholder='Type you comment here...'
					id='comment-input-field'
					cols='30'
					rows='2'
					name='comment-input'
				/>
			</div>
		</div>
	);
};

CommentsContainer.propTypes = {
	comments: PropTypes.array.isRequired,
	submit: PropTypes.func.isRequired
};

export default CommentsContainer;
