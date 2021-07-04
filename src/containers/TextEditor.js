import React from 'react';

const TextEditor = () => {
	return (
		<div className='container-fluid text-center py-5 px-5'>
			<h1 className='py-3'>Editor</h1>
			<div className='px-5' />
			<div className='pt-4'>
				<button className='btn btn-lg text-capitalize'>Submit</button>
			</div>
		</div>
	);
};

TextEditor.propTypes = {};

export default TextEditor;
