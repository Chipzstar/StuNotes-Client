import React, { useEffect, useRef } from 'react';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb'
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import 'quill/dist/quill.snow.css';

Quill.register('modules/cursors', QuillCursors);

const QuillEditor = ({roomName, placeholder, theme}) => {
	let quillRef = useRef(null);

	const toolbarOptions = [
		[{font: []}],
		[
			{
				header: [1, 2, 3, 4, false],
			},
		],
		['bold', 'italic', 'underline'],
		[{script: 'sub'}, {script: 'super'}],
		[{list: 'ordered'}, {list: 'bullet'}, {indent: '-1'}, {indent: '+1'}],
		[{align: []}],
		['blockquote', 'code-block', 'link', 'image', 'video'],
		['clean'],
	]

	useEffect(() => {
		const yDoc = new Y.Doc();
		const persistence = new IndexeddbPersistence(roomName, yDoc)

		const wsProvider = new WebsocketProvider('ws://localhost:1234', roomName, yDoc); // change to 'ws://localhost:3000'
		// for local development

		const yText = yDoc.getText('quill');

		const editor = new Quill(document.querySelector('#editor'), {
			modules: {
				cursors: true,
				toolbar: toolbarOptions,
				history: {
					// Local undo shouldn't undo changes
					// from remote users
					userOnly: true,
				},
			},
			placeholder,
			theme, // 'bubble' is also great
		});

		const binding = new QuillBinding(yText, editor, wsProvider.awareness);

		persistence.once('synced', () => console.log('initial content loaded'))

		wsProvider.on('status', event => {
			console.log(event.status)
		})

		window.addEventListener('blur', () => editor.blur());
		return () => {
			binding.destroy()
			wsProvider.destroy()
		}
	}, []);

	// const insertText = () => {
	// 	var range = quillRef.getSelection();
	// 	let position = range ? range.index : 0;
	// 	quill.insertText(position, 'Hello, World! ');
	// };

	return (
		<div id='editor' className="text-editor"/>
	);
};

export default QuillEditor;
