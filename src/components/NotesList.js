import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useNotesStore } from '../store';
import '../stylesheets/App.css';

const NotesList = ({ onSelect, newIndex }) => {
	const { notes } = useNotesStore()
	const [activeIndex, setActive] = useState(newIndex);

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
		'align-items-start': true,
	});

	return (
		<div className='list-group overflow-y-scroll max-container w-100'>
			{notes.map(({ id, title, description, author, createdAt }, index) => {
				//console.log("Doc", index, "=>", id)
				return index === activeIndex ?
					(
						<div key={index} className={activeDoc} onClick={() => setActive(index)} role="button">
							<div className='d-flex w-100 justify-content-between'>
								<h5 className='mb-1'>{title}</h5>
								<small>{createdAt}</small>
							</div>
							<p className='mb-1'>{description}</p>
							<small>{author}</small>
						</div>
					) : (
						<div key={index} className={inactiveDoc} onClick={() => {
							setActive(index);
							onSelect(id, title, author);
						}} role="button">
							<div className='d-flex w-100 justify-content-between'>
								<h5 className='mb-1'>{title}</h5>
								<small>{createdAt}</small>
							</div>
							<p className='mb-1'>{description}</p>
							<small>{author}</small>
						</div>
					);
			})}
		</div>
	);
};

NotesList.propTypes = {
	onSelect: PropTypes.func.isRequired
};

export default NotesList;
