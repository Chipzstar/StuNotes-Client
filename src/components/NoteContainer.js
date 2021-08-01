import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Offcanvas } from 'react-bootstrap';
//images
import document from '../assets/svg/document.svg';
import team from '../assets/svg/team.svg';
import priceTag from '../assets/svg/price-tag.svg';
import share from '../assets/svg/share.svg';
import upload from '../assets/svg/cloud-upload.svg';
import newMember from '../assets/svg/new-member.svg';
//components
import QuillEditor from './QuillEditor';
import Tag from './Tag';
import MembersContainer from './MembersContainer';
import { Modal } from 'bootstrap';
import { useNotesStore } from '../store';
import NewMemberForm from '../modals/NewMemberForm';
import CommentsContainer from './CommentsContainer';

const NoteContainer = ({
	                       type,
	                       notebookId,
	                       notebookName,
	                       status,
	                       author,
	                       noteId,
	                       title,
	                       tags,
	                       members,
	                       comments,
	                       onTitleChange,
	                       onDescriptionChange,
	                       onNewTag,
	                       onRemoveTag,
	                       onNewNote,
	                       onNewComment
                       }) => {
	const { notebook: NOTEBOOK, group: GROUP } = useParams();
	const { groups, notebooks, addMember } = useNotesStore(useCallback(state => state, []));


	const [tag, setTag] = useState('');
	const [showMembers, setShowMembers] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [memberModal, setMemberModal] = useState(false);
	const memberRef = useRef(null);

	useEffect(() => {
		setMemberModal(new Modal(memberRef.current));
	}, []);

	const handleTag = useCallback(
		(e) => {
			let { value } = e.target;
			setTag(value.toLowerCase());
		}, []);

	//TODO - check if passing "type" as a prop can replace type memo
	//const type = useMemo(() => NOTEBOOK ? TYPES.PERSONAL : GROUP ? TYPES.SHARED : null, [NOTEBOOK, GROUP]);

	//TODO - debug editor slow response when typing
	const hasNotes = useMemo(() => {
		if (NOTEBOOK) {
			return notebooks.find(item => item.name === NOTEBOOK).notes.length;
		} else if (GROUP) {
			let group = groups.find(item => item.name === GROUP);
			return group && group.notes.length;
		} else return false;
	}, [NOTEBOOK, GROUP, notebooks, groups]);

	return (
		<div className='container-fluid d-flex flex-column h-100 text-center pb-3'>
			<NewMemberForm onSubmit={({ email }) => {
				addMember(GROUP, email)
					.then((msg) => {
						memberModal.hide();
						alert(msg);
					})
					.catch(err => alert(err));
			}} ref={memberRef} />
			<div className='d-flex flex-row align-items-center justify-content-between px-2 pb-3'>
				<div className='d-flex align-items-center'>
					<div className='d-flex flex-row align-items-center'>
						{NOTEBOOK ? <img src={document} width={25} height={25} alt='' /> :
							<img src={team} width={30} height={30} alt='' />}
						<span className='lead text-capitalize fw-bold ps-3'>{notebookName}</span>
					</div>
					{GROUP && <div role='button' className='btn btn-sm btn-success text-lowercase mx-3'
					               onClick={() => setShowMembers(true)}>
						View Members
					</div>}
					{GROUP && <div role='button' onClick={() => memberModal.show()} className='me-2'>
						<img src={newMember} width={30} height={30} alt='new member' />
					</div>}
					<div className='d-flex flex-row align-items-center ps-5'>
						<img src={priceTag} width={25} height={25} alt='' />
						<form onSubmit={(event) => {
							onNewTag(event);
							setTag('');
						}}>
							<input
								placeholder='Press enter to add tags'
								name='tag'
								type='text'
								className='lead text-muted ps-3 border-0 borderless'
								onChange={handleTag}
								value={tag}
								disabled={tags.length >= 5}
							/>
						</form>
					</div>
				</div>
				<div id='tag-container' className='d-flex flex-grow-1 flex-wrap mx-2'>
					<ul id='tags' className='d-flex flex-wrap mt-2'>
						{tags.map((item, index) => <Tag key={index} name={item} remove={onRemoveTag} />)}
					</ul>
				</div>
				<div>
					<div className='d-flex flex-row'>
						<div role='button' className='me-3'>
							<img src={share} width={25} height={25} alt='share' />
						</div>
						<div role='button'>
							<img src={upload} width={25} height={25} alt='upload' />
						</div>
					</div>
				</div>
			</div>
			{hasNotes ? (
				<div className='d-flex flex-column flex-grow-1'>
					<div className='d-flex flex-row align-items-center justify-content-between px-2 pt-2'>
						{/*TODO - check styling*/}
						<div>
							<input
								name='title'
								type='text'
								value={title}
								onChange={(e) => onTitleChange(e, type)}
								placeholder='Untitled'
								className='h1 fw-bold border-0 borderless'
							/>
						</div>
						<div>
							<span className='text-muted font-italic'>{status}</span>
						</div>
						<div>
							<span>Author: <span className='fw-bold'>{author}</span></span>
						</div>
					</div>
					<hr className='border-2' />
					<QuillEditor
						type={type}
						notebookId={notebookId}
						room={noteId}
						toggleComments={() => setShowComments(!showComments)}
						onChange={onDescriptionChange}
					/>
				</div>
			) : (
				<div className='d-flex min-vh-100 flex-column justify-content-center align-items-center mx-auto py-3'>
					<div className='d-grid gap-2 d-md-block'>
						<button className='btn btn-info big-btn' onClick={onNewNote}>
							Create your first note
						</button>
					</div>
					<div className='py-5'>
						<p className='text-muted display-6'>In future click the blue button at the top left to create
							new notes</p>
					</div>
				</div>
			)}
			<Offcanvas show={showMembers} onHide={() => setShowMembers(false)} placement='bottom' scroll>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						Members
					</Offcanvas.Title>
				</Offcanvas.Header>
				<Offcanvas.Body>
					<div>
						<MembersContainer members={members} />
					</div>
				</Offcanvas.Body>
			</Offcanvas>
			<Offcanvas show={showComments} onHide={() => setShowComments(false)} placement='end' scroll>
				<Offcanvas.Header closeButton>
					<Offcanvas.Title>
						Activity
					</Offcanvas.Title>
				</Offcanvas.Header>
				<hr className='border' />
				<Offcanvas.Body className='d-flex'>
					<CommentsContainer comments={comments} submit={onNewComment} />
				</Offcanvas.Body>
			</Offcanvas>
		</div>
	);
};

NoteContainer.propTypes = {
	type: PropTypes.string.isRequired,
	notebookId: PropTypes.string.isRequired,
	notebookName: PropTypes.string.isRequired,
	noteId: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	author: PropTypes.string.isRequired,
	tags: PropTypes.array.isRequired,
	comments: PropTypes.array.isRequired,
	members: PropTypes.array.isRequired,
	onTitleChange: PropTypes.func.isRequired,
	onDescriptionChange: PropTypes.func.isRequired,
	onNewTag: PropTypes.func.isRequired,
	onRemoveTag: PropTypes.func.isRequired,
	onNewNote: PropTypes.func.isRequired,
	onNewComment: PropTypes.func.isRequired
};

export default NoteContainer;
