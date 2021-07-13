import { useRef, useState } from 'react';

const useCalendar = (filter) => {
	const [date, setDate] = useState(new Date());
	const ref = useRef()

	const handleDateChange = (date) => {
		setDate(date);
		filter(date)
	};
	return [ref, date, handleDateChange]
};

export default useCalendar

