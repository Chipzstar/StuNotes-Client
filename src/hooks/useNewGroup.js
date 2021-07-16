import { useState } from 'react';
import { nanoid } from 'nanoid';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';
import { useParams } from 'react-router-dom';

const useNewGroup = () => {
	const user = useAuth();
	const {group, GROUP, id: ID} = useParams()
	const { groups, addGroup } = useNotesStore();
	const [id, setId] = useState(null);
	const [name, setName] = useState(GROUP ? GROUP : "");

	async function createNewGroup(name) {
		try {
			for (let group of groups) {
				if (group.name === name) {
					return new Error('Name already exists');
				}
			}
			let id = nanoid(16);
			let group = await addGroup(user.uid, id, name, user.displayName);
			console.log("NEW GROUP:", group)
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
		await createNewGroup(name)
		return name
	}

	return { id, name, handleChange, handleSubmit }
};

export default useNewGroup;
