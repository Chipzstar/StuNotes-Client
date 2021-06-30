import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const NewNoteBtn = () => {
	return (
		<div className='d-flex justify-content-center align-items-center'>
			<button className='btn btn-lg btn-info add-btn'>
				<AiOutlinePlus size={20} className=""/>
			</button>
		</div>
	);
};

export default NewNoteBtn;
