import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';

const useNewNotebook = () => {
	const user = useAuth();
	const { notebooks, addNotebook } = useNotesStore();
	const [id, setId] = useState(notebooks.length ? notebooks[0].id : null);
	const [name, setName] = useState(notebooks.length ? notebooks[0].name : '');

	async function createNewNotebook(name) {
		try {
			for (let item of notebooks) {
				if (item.name === name) {
					return new Error('Name already exists');
				}
			}
			let id = nanoid(16);
			await addNotebook(user.uid, id, name);
			console.log(notebooks)
			setId(id);
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
		await createNewNotebook(name)
		return name
	}

	return { id, name, handleChange, handleSubmit }
};

export default useNewNotebook
