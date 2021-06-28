import React, { useEffect } from 'react';
import { useMsgStore } from '../store';

const TextEditContainer = ({ socket }) => {
	const { msg, setMessage } = useMsgStore(state => state);

	useEffect(() => {
		socket.on('chat message', msg => {
			setMessage(msg);
		});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		alert('FINAL MESSAGE: ' + msg);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === 'msg') {
			setMessage(value);
		}
		socket.emit('chat message', socket.id, value);
	};

	return (
		<div className='container py-5'>
			<h2 className='pb-3'>Text Edit Container</h2>
			<form action='' onSubmit={handleSubmit}>
				<textarea
					name='msg'
					id='text-container'
					className='form-control mb-4'
					cols='50'
					rows='15'
					value={msg}
					placeholder='Write something here...'
					onChange={(event) => handleChange(event)}
					//onKeyDown={(e) => e.key === 'Enter' ? handleSubmit(e) : null}
				/>
				<div className='d-flex justify-content-around'>
					<button className='btn btn-secondary' type='submit'>Submit</button>
					<a href='/yjs' className='btn btn-primary'>Go to Quill</a>
				</div>
			</form>
		</div>
	);
};

export default TextEditContainer;
