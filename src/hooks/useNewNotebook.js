import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';

const useNewNotebook = () => {
	const user = useAuth();
	const { notebooks, addNotebook } = useNotesStore();
	const [name, setName] = useState('');

	async function createNewNotebook(name) {
		try {
			for (let item of notebooks) {
				if (item.name === name) {
					return new Error('Name already exists');
				}
			}
			let id = nanoid(16);
			let notebook = await addNotebook(user.uid, id, name, user.displayName);
			console.log(notebook);
		} catch (err) {
			console.error(err);
		}
	}

	const handleChange = (e) => {
		let { value } = e.target;
		setName(value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await createNewNotebook(name);
		return name;
	};

	return { name, handleChange, handleSubmit };
};

export default useNewNotebook;
