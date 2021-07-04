import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const NewNoteBtn = ({newNote}) => {
	return (
		<div className='d-flex justify-content-center align-items-center'>
			<button className='btn btn-lg btn-info add-btn' onClick={newNote}>
				<AiOutlinePlus size={25} className=""/>
			</button>
		</div>
	);
};

export default NewNoteBtn;
