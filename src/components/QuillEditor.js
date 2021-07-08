import React from 'react';
import PropTypes from 'prop-types';
import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { WebsocketProvider } from 'y-websocket';
import { QuillBinding } from 'y-quill';
import withStore from '../hoc/withStore';
import { AuthContext } from '../contexts/AuthContext';

Quill.register('modules/cursors', QuillCursors);

class QuillEditor extends React.Component {
	static contextType = AuthContext
	constructor(props) {
		super(props);
		this.state = {
			isMounted: null
		};
		this.binding = null
		this.quill = null
		this.wsProvider = null
		this.awareness = null
	}

	componentDidMount() {
		const { room } = this.props;
		//this.persistence = new IndexeddbPersistence(room, yDoc);
		this.yDoc = new Y.Doc({ guid: this.context.uid });
		console.log(this.yDoc)

		this.yText = this.yDoc.getText('quill');
		console.log(this.yText)

		this.bindEditor(this.yText, room, this.yDoc)
		/*
		this.persistence.on('synced', () => console.log('initial content loaded'));
		*/
		this.initObservers(room)
		window.addEventListener('blur', () => this.quill.blur());
	}

	shouldComponentUpdate(nextProps, nextState, nextContext) {
		if (this.props.room !== nextProps.room){
			this.resetYDoc(nextProps.room)
			return true
		}
		return false
	}

	componentWillUnmount() {
		//this.persistence.destroy()
		this.wsProvider.destroy();
		this.yDoc.destroy();
	}

	initObservers(room) {
		this.yText.observe(() => {
			let text = this.quill.getText()
			let index = this.props.store.notes.findIndex(item => item.id === room)

			if (text.length === 100 && this.props.store.notes[index]['description'] !== text){
				this.props.store.updateMetaInfo(room, {description: text.padEnd(103, "...")})
				this.props.onChange(room, {description: text.padEnd(103, "...")})
			} else if (text.length < 100 && this.props.store.notes[index]['description'] !== text) {
				this.props.store.updateMetaInfo(room, {description: text})
				this.props.onChange(room, {description: text})
			}
		})

		this.wsProvider.on('status', event => {
			console.log(event.status);
		});
		this.wsProvider.on('sync', (isSynced) => console.log(isSynced ? "synced" : "not synced"))
	}

	resetYDoc = (room) => {
		this.wsProvider.destroy();
		this.yDoc = new Y.Doc({ guid: this.context.uid });
		this.yText = this.yDoc.getText('quill');
		//console.count("BINDING TO EDITOR")
		this.bindEditor(this.yText, room, this.yDoc)
		this.initObservers(room)
	}

	bindEditor = (yText, room) => {
		if (this.binding) {
			this.binding.destroy()
		}
		if (this.quill === null) {
			this.quill = new Quill(document.querySelector('#editor'), {
				modules: {
					cursors: true,
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
		this.wsProvider = new WebsocketProvider('ws://localhost:1234', room, this.yDoc); // change to
		this.binding = new QuillBinding(this.yText, this.quill, this.wsProvider.awareness)
	}

	render() {
		return (
			<div>
				<div id='toolbar' className="border-0">
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
				</div>
				<div id='editor' className='text-editor border-0' style={{fontSize: "120%"}}/>
			</div>
		);
	}
}

QuillEditor.propTypes = {
	room: PropTypes.string.isRequired
};

export default withStore(QuillEditor);
