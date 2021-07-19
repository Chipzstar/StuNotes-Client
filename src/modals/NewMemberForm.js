import React from 'react';
import { Formik } from 'formik';

const NewMemberForm = React.forwardRef(({ onSubmit }, ref) => {

	return (
		<div className='modal fade show' id='newMemberModal' tabIndex='-1' aria-labelledby='new member modal form'
		     aria-hidden='true' ref={ref}>
			<div className='modal-dialog modal-lg modal-dialog-centered'>
				<div className='modal-content rounded-5 py-2 px-3'>
					<div className='modal-header border-0'>
						<h5 className='modal-title' id='exampleModalLabel'>Add members to group</h5>
					</div>
					<Formik
						initialValues={{
							email: "",
							permission: "Viewer"
						}}
						onSubmit={onSubmit}
					>
						{({handleChange, handleSubmit, values, handleBlur}) => (
							<form onSubmit={handleSubmit}>
								<div className='modal-body'>
									<div className='row'>
										<div className='col-9'>
											<input
												autoComplete="off"
												id='newMemberEmail'
												type='email'
												name="email"
												required
												onChange={handleChange}
												onBlur={handleBlur}
												placeholder='Enter email to invite someone ...'
												className='form-control rounded-5'
												aria-describedby='emailHelp'
											/>
										</div>
										<div className='col-3'>
											<select
												value={values.permission}
												name="permission"
												className='form-select'
												aria-label='select menu for note permissions'
												onChange={handleChange}
												onBlur={handleBlur}
											>
												<option value='Regular'>Regular User</option>
												<option value='Admin'>Admin</option>
												<option value='Viewer'>Viewer</option>
											</select>
										</div>
									</div>
								</div>
								<div className='modal-footer border-0'>
									<div role='button'
									     className='btn btn-outline- rounded-pill text-capitalize bg-transparent border-0'
									     data-bs-dismiss='modal'>
										<span className='fw-bold' style={{ color: '#616161' }}>Discard</span>
									</div>
									<button type='submit' className='btn fw-bold text-light btn-info rounded-pill text-capitalize send'>
										Send
									</button>
								</div>
							</form>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
});

NewMemberForm.propTypes = {};

export default NewMemberForm;
