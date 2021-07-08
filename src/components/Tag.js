import React from 'react';
import PropTypes from 'prop-types';

const Tag = ({ name, remove }) => {
	return (
		<li className='d-flex align-items-center justify-content-center text-light bg-info px-2 me-2 mb-1 tag'>
			<div className="">
				<span className="me-2">{name}</span>
				<button className='btn-sm btn-close' onClick={() => remove(name)}/>
			</div>
		</li>
	);
};

Tag.propTypes = {
	name: PropTypes.string.isRequired,
	remove: PropTypes.func.isRequired
};

export default Tag;
