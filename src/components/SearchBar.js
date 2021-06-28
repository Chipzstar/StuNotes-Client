import React from 'react';

const SearchBar = () => {
	return (
		<div className='px-3'>
			<div className='input-group input-group-lg form-outline w-100'>
				<input type='search' id='search-lg' className='form-control search-input rounded' autoComplete='on' />
				<label className='form-label' htmlFor='search-lg' aria-describedby='search-lg'>Search notes</label>
			</div>
		</div>
	);
};

export default SearchBar;
