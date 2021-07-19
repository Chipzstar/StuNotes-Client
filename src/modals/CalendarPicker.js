import React from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';

const CalendarPicker = ({ modalRef, onChangeHandler, date }) => {
	return (
		<div className='modal fade show' ref={modalRef} tabIndex='-1' aria-hidden='true'>
			<div className='modal-dialog modal-dialog-centered'>
				<div className='modal-content d-flex align-items-center justify-content-center bg-transparent border-0'>
					<div className='modal-body'>
						<Calendar onChange={onChangeHandler} value={date} />
					</div>
				</div>
			</div>
		</div>
	);
};

CalendarPicker.propTypes = {
	modalRef: PropTypes.oneOfType([
		PropTypes.func,
		PropTypes.shape({ current: PropTypes.any })
	]),
	onChangeHandler: PropTypes.func.isRequired,
	date: PropTypes.instanceOf(Date)
};

export default CalendarPicker;
