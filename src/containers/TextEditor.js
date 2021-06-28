import React from 'react';
import QuillEditor from '../components/QuillEditor';
import { useDocumentStore, useFilesStore } from '../store';

const TextEditor = () => {
	const { content, setContent } = useDocumentStore();
	const { files, addFile} = useFilesStore()

	const onEditorChange = (value) => {
		setContent(value)
		console.log(value)
	};

	const onFileChange = (file) => {
		addFile(file)
	}

	return (
		<div className='container text-center py-5 px-5'>
			<h1 className='py-3'>Editor</h1>
			<div className='px-5'>
				<QuillEditor
					placeholder={'Write something here...'}
					onEditorChange={onEditorChange}
					onFileChange={onFileChange}
				/>
			</div>
			<div className='pt-4'>
				<button className='btn btn-lg text-capitalize'>Submit</button>
			</div>
		</div>
	);
};

TextEditor.propTypes = {};

export default TextEditor;
