import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const Comment = ({ comment, author, createdAt }) => {
	return (
		<div className="d-flex flex-column">
			<div className='d-flex justify-content-between'>
				<h5 className='mb-1'>{author}</h5>
				<small className="text-muted">{moment(createdAt).fromNow()}</small>
			</div>
			<span className="mt-1">{comment}</span>
			<div>
				<button className='btn btn-sm btn-outline- text-lowercase fw-bold text-muted lead'>reply</button>
			</div>
		</div>
	);
};

Comment.propTypes = {
	comment: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	createdAt: PropTypes.any.isRequired
};

export default Comment;
