import React from 'react';

const SearchBar = ({ onSearch }) => {
	return (
		<div className='form-floating input-group form-outline w-100'>
			<input
				placeholder="search..."
				id='search-lg'
				type='search'
				className='form-control search-input rounded rounded-3'
				autoComplete='on'
				onChange={onSearch}
			/>
			<label className='form-label' htmlFor='search-lg' aria-describedby='search-lg'>Search notes</label>
		</div>
	);
};

export default SearchBar;
