import { useState } from 'react'

const useSort = (sort) => {
	const [sortOrder, setSort] = useState("default");

	const toggleSort = () => {
		console.log('sorting...');
		if (sortOrder === 'desc') {
			setSort('asc');
			sort('asc')
		} else {
			setSort('desc');
			sort("desc")
		}
	};

	return [toggleSort]
};

export default useSort

