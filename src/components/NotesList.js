import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import '../stylesheets/App.css';

const NotesList = ({ documents, onSelect }) => {
	const [activeIndex, setActive] = useState(null);

	const activeDoc = classNames({
		'list-group-item': true,
		'list-group-item-action': true,
		'flex-column': true,
		'align-items-start': true,
		'active': true
	});

	const inactiveDoc = classNames({
		'text-dark': true,
		'list-group-item': true,
		'list-group-item-action': true,
		'flex-column': true,
		'align-items-start': true
	});
	return (
		<div className='list-group overflow-y-scroll max-container'>
			{documents.map(({ title, description, author, createdAt }, index) => {
				return index === activeIndex ?
					(
						<a key={index} href='#' className={activeDoc} onClick={() => setActive(index)}>
							<div className='d-flex w-100 justify-content-between'>
								<h5 className='mb-1'>{title}</h5>
								<small>{createdAt}</small>
							</div>
							<p className='mb-1'>{description}</p>
							<small>{author}</small>
						</a>
					) : (
						<a key={index} href='#' className={inactiveDoc} onClick={() => {
							setActive(index);
							onSelect(title, author);
						}}>
							<div className='d-flex w-100 justify-content-between'>
								<h5 className='mb-1'>{title}</h5>
								<small>{createdAt}</small>
							</div>
							<p className='mb-1'>{description}</p>
							<small>{author}</small>
						</a>
					);
			})}
		</div>
	);
};

NotesList.propTypes = {
	documents: PropTypes.array.isRequired,
	onSelect: PropTypes.func.isRequired
};

export default NotesList;
