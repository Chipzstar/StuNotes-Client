import React from 'react';
import PropTypes from 'prop-types';
import * as Y from 'yjs';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import withStore from '../hoc/withStore';
import { AuthContext } from '../contexts/AuthContext';
import { COLOURS, TYPES } from '../constants';
import { CgComment } from 'react-icons/cg';

Quill.register('modules/cursors', QuillCursors);

class QuillEditor extends React.Component {
	static contextType = AuthContext;

	constructor(props) {
		super(props);
		this.state = {
			isMounted: null,
			metaData: []
		};
		this.binding = null;
		this.quill = null;
		this.wsProvider = null;
		this.awareness = null;
	}

	componentDidMount() {
		console.log("SERVER URL:", process.env.REACT_APP_SERVER_URL)
		const { type, notebookId, room } = this.props;
		console.table({ type, notebookId, room });
		//this.persistence = new IndexeddbPersistence(room, yDoc);
		this.yDoc = new Y.Doc({ guid: this.context.uid });
		console.log(this.yDoc);

		this.yText = this.yDoc.getText('quill');
		console.log(this.yText);

		this.bindEditor(this.yText, room, this.yDoc);
		/*
		this.persistence.on('synced', () => console.log('initial content loaded'));
		*/
		type === TYPES.SHARED ? this.initGroupObservers(notebookId, room) : this.initNotebookObservers(room);
		window.addEventListener('blur', () => this.quill.blur());
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (this.props.room !== nextProps.room) {
			console.table({ type: nextProps.type, notebookId: nextProps.notebookId, room: nextProps.room });
			this.resetYDoc(nextProps.type, nextProps.notebookId, nextProps.room);
			return true;
		}
		return false;
	}

	componentWillUnmount() {
		//this.persistence.destroy()
		this.wsProvider.destroy();
		this.yDoc.destroy();
	}

	initNotebookObservers(room) {
		this.yText.observe(() => {
			let text = this.quill.getText();
			let index = this.props.store.notebooks[0].notes.findIndex(item => item.id === room);
			if (text.length < 100 && this.props.store.notebooks[0].notes[index]['description'] !== text) {
				this.props.store.updateNotebookNote(room, { description: text });
				this.props.onChange(room, { description: text });
			} else if (text.length === 100 && this.props.store.notebooks[0].notes[index]['description'] !== text) {
				this.props.store.updateNotebookNote(room, { description: text.padEnd(103, '...') });
				this.props.onChange(room, { description: text.padEnd(103, '...') });
			}
		});
		this.wsProvider.on('status', event => {
			console.log(event.status);
		});
		this.wsProvider.on('sync', (isSynced) => console.log(isSynced ? 'synced' : 'not synced'));
	}

	initGroupObservers(id, room) {
		this.yText.observe(() => {
			let text = this.quill.getText();
			if (text.length < 100 && this.props.store.groups.find(item => item.id === id)['description'] !== text) {
				this.props.store.updateGroupNote(id, room, { description: text });
				this.props.onChange(room, { description: text });
			} else if (text.length === 100 && this.props.store.groups.find(item => item.id === id)['description'] !== text) {
				this.props.store.updateGroupNote(id, room, { description: text.padEnd(103, '...') });
				this.props.onChange(room, { description: text.padEnd(103, '...') });
			}
		});
		this.wsProvider.on('status', event => {
			console.log(event.status);
		});
		this.wsProvider.on('sync', (isSynced) => console.log(isSynced ? 'synced' : 'not synced'));
	}

	resetYDoc = (type, notebookId, room) => {
		this.wsProvider.destroy();
		this.yDoc = new Y.Doc({ guid: this.context.uid });
		this.yText = this.yDoc.getText('quill');
		this.bindEditor(this.yText, room, this.yDoc);
		if (type === TYPES.SHARED) {
			this.initGroupObservers(notebookId, room);
		} else {
			this.initNotebookObservers(room);
		}
	};

	bindEditor = (yText, room) => {
		if (this.binding) {
			this.binding.destroy();
		}
		if (this.quill === null) {
			this.quill = new Quill(document.querySelector('#editor'), {
				modules: {
					cursors: {
						hideDelayMs: 5000,
						hideSpeedMs: 0,
						selectionChangeSource: null,
						transformationOnTextChange: true,
					},
					toolbar: '#toolbar',
					history: {
						// Local undo shouldn't undo changes
						// from remote users
						userOnly: true
					}
				},
				placeholder: 'Write something here...',
				theme: 'snow' // 'bubble' is also great
			});
		}
		this.wsProvider = new WebsocketProvider(process.env.REACT_APP_SERVER_URL || 'wss://stunotes-server.herokuapp.com', room, this.yDoc);
		this.wsProvider.awareness["setLocalStateField"]("user", {
			name: this.context.displayName,
			color: COLOURS[Math.floor(Math.random() * COLOURS.length)]
		})
		this.binding = new QuillBinding(this.yText, this.quill, this.wsProvider.awareness);
	};

	/*onNewComment = () => {
		let { notebookId, room } = this.props;
		this.quill.focus();
		let range = this.quill.getSelection();
		console.log(range);
		let comment = prompt('Please enter Comment', '');
		console.log(comment);
		if (comment == null || comment === '') {
			alert('User cancelled the prompt');
		} else {
			if (range) {
				if (!range.length) {
					alert('Please select text');
				} else {
					let text = this.quill.getText(range.index, range.length);
					console.log('User has highlighted: ', text);
					this.state.metaData.push({ range, comment });
					this.quill.formatText(range.index, range.length, {
						background: '#fff72b'
					});
				}
			} else {
				alert('User cursor is not in editor');
			}
		}
		this.quill.blur();
	};*/

	render() {
		return (
			<div>
				<div id='toolbar' className='border-0'>
				<span className='ql-formats'>
					<select className='ql-font' />
					<select defaultValue={''} onChange={e => e.persist()} className='ql-header'>
						<option value='1' />
						<option value='2' />
						<option value='3' />
						<option value='false' />
					</select>
				</span>
					<span className='ql-formats'>
					<button className='ql-bold' />
					<button className='ql-italic' />
					<button className='ql-underline' />
					<button className='ql-strike' />
				</span>
					<span className='ql-formats'>
			      <select className='ql-color' />
			      <select className='ql-background' />
			    </span>
					<span className='ql-formats'>
			      <button className='ql-script' value='sub' />
			      <button className='ql-script' value='super' />
			    </span>
					<span className='ql-formats'>
			      <button className='ql-header' value='1' />
			      <button className='ql-header' value='2' />
			      <button className='ql-blockquote' />
			      <button className='ql-code-block' />
			    </span>
					<span className='ql-formats'>
			      <button className='ql-list' value='ordered' />
			      <button className='ql-list' value='bullet' />
			      <button className='ql-indent' value='-1' />
			      <button className='ql-indent' value='+1' />
			    </span>
					<span className='ql-formats'>
			      <button className='ql-direction' value='rtl' />
			      <select className='ql-align' />
			    </span>
					<span className='ql-formats'>
			      <button className='ql-link' />
			      <button className='ql-image' />
			      <button className='ql-video' />
			      <button className='ql-formula' />
			    </span>
					<span className='ql-formats'>
			      <button className='ql-clean' />
			    </span>
					<span className='ql-formats' role='button'>
						<CgComment size={19} className='mb-1' onClick={this.props.toggleComments} />
					</span>
				</div>
				<div id='editor' className='text-editor border-0' style={{ fontSize: '100%' }} />
			</div>
		);
	}
}

QuillEditor.propTypes = {
	room: PropTypes.string.isRequired,
	notebookId: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	toggleComments: PropTypes.func.isRequired
};

export default withStore(QuillEditor);
