import React, { useState } from 'react';
import { useNotesStore } from '../store';

const useSearch = (search) => {
	const [query, setQuery] = useState(new Date());

	const handleSearch = (e) => {
		let { value } = e.target;
		setQuery(value)
		search(query)
	}

	return [handleSearch]
};

export default useSearch;
