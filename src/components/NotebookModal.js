import React from 'react';
import PropTypes from 'prop-types';

const NotebookModal = React.forwardRef(({ name, onSubmit, onChange }, ref) => {
	return (
		<div className='modal fade show' ref={ref} tabIndex='-1' aria-hidden='true'>
			<div className='modal-dialog modal-dialog-centered'>
				<div className='modal-content border-0'>
					<div className='modal-header'>
						<h5>Add Notebook</h5>
						<button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
					</div>
					<div className='modal-body'>
						<form onSubmit={onSubmit}>
							<input
								type='text'
								id='notebook-name'
								name='notebook-name'
								onChange={onChange}
								value={name}
								className='form-control'
								aria-describedby='passwordHelpBlock' />
							<div id='passwordHelpBlock' className='form-text'>
								Enter a suitable name for your new notebook
							</div>
							<div className='d-flex justify-content-end'>
								<button type="submit" className='btn btn-info btn-sm text-capitalize w-25 fw-bold'>Add</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
});

NotebookModal.propTypes = {
	name: PropTypes.string.isRequired,
	onSubmit: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default NotebookModal;
