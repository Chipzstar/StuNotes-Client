import React from 'react';

const SearchBar = ({ onSearch }) => {
	return (
		<div className='input-group input-group-lg form-outline w-100'>
			<input type='search' id='search-lg' className='form-control search-input rounded' autoComplete='on'
			       onChange={onSearch} />
			<label className='form-label' htmlFor='search-lg' aria-describedby='search-lg'>Search notes</label>
		</div>
	);
};

export default SearchBar;
