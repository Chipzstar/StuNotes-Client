import React from 'react';

const NewNoteBtn = () => {
	return (
		<div className='d-flex'>
			<button className='btn btn-lg btn-info rounded-circle add-btn'>
				<i className="glyphicon glyphicon-search" aria-hidden="true"/>
			</button>
		</div>
	);
};

export default NewNoteBtn;
