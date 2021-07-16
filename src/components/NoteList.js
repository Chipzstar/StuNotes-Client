import React, { useCallback, useEffect, useState } from 'react';
import { ReactComponent as Trash } from '../assets/svg/trash.svg';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import logo from '../assets/images/logo.png';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import { useNotesStore } from '../store';
import { useHistory, useParams } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { useMeasure } from 'react-use';

const NoteList = ({ uid, filteredData, onSelect }) => {
	let { notebook: NOTEBOOK, id: ID, group: GROUP } = useParams();
	const [showToast, setShow] = useState(false);
	const { notebooks, removeNotebookNote } = useNotesStore(useCallback(state => state, [ID, NOTEBOOK]));
	const history = useHistory()
	const [divRef1, { height:outerDivHeight }] = useMeasure();
	const [divRef2 ] = useMeasure();

	/*useEffect(() => {
		console.log("inner", innerDivHeight)
	}, [innerDivHeight]);

	useEffect(() => {
		console.log("outer", outerDivHeight)
	}, [outerDivHeight]);*/

	useEffect(() => {
		console.log("NOTE_ID", ID)
	}, [ID]);

	const activeDoc = classNames({
		'list-group-item': true,
		'rounded-5': true,
		'list-group-item-action': true,
		'flex-column': true,
		'align-items-start': true,
		'active': true
	});

	const inactiveDoc = classNames({
		'text-dark': true,
		'list-group-item': true,
		'list-group-item-action': true,
		'flex-column': true,
		'rounded-5': true,
		'align-items-start': true
	});

	const alertMessage = (
		<div className='modal fade show' id='deleteModal' data-bs-backdrop='static' tabIndex='-1' aria-hidden='true'>
			<div className='modal-dialog'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title'>Hold Up!</h5>
						<button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
					</div>
					<div className='modal-body'>
						Are you sure you want to delete this note?
					</div>
					<div className='modal-footer'>
						<button type='button' className='btn bg-info text-black' data-bs-dismiss='modal'>No</button>
						<button
							type='button'
							className='btn bg-primary text-black fw-bold'
							data-bs-dismiss='modal'
							onClick={() => removeNotebookNote(uid, ID).then(() => {
								setShow(true)
								history.goBack()
							})}
						>
							Yes
						</button>
					</div>
				</div>
			</div>
		</div>
	);

	const toastConfirmation = (
		<ToastContainer position='bottom-end'>
			<Toast onClose={() => setShow(false)} show={showToast} delay={2000} autohide>
				<Toast.Header closeButton={false}>
					<img src={logo} width={50} height={50} className='rounded me-2' alt='' />
					<span>Note deleted!</span>
				</Toast.Header>
			</Toast>
		</ToastContainer>
	);

	return (
		<div ref={divRef1} className="w-100">
			<Scrollbars autoHeight autoHeightMin={outerDivHeight} autoHide >
				<div className='list-group' ref={divRef2}>
					{alertMessage}
					{filteredData.map(({ id, title, description, author, createdAt, tags }, index) => {
						//console.log("Doc", index, "=>", id)
						return id === ID ?
							(
								<a key={index} className={activeDoc}>
									<div className='d-flex w-100 justify-content-between'>
										<h5 className='mb-1'>{title}</h5>
										<small>{moment(createdAt).fromNow()}</small>
									</div>
									<p className='mb-1'>{description}</p>
									<div className='d-flex flex-row justify-content-between'>
										<small>{author}</small>
										<div data-bs-toggle='modal' data-bs-target='#deleteModal' role='button'>
											<Trash width={25} height={25} fill={'white'} />
										</div>
									</div>
								</a>
							) : (
								<a key={index} className={inactiveDoc} onClick={() => {
									onSelect(id, title, author, tags);
								}}>
									<div className='d-flex w-100 justify-content-between'>
										<h5 className='mb-1'>{title}</h5>
										<small>{moment(createdAt).fromNow()}</small>
									</div>
									<p className='mb-1'>{description}</p>
									<small>{author}</small>
								</a>
							);
					})}
					{toastConfirmation}
				</div>
			</Scrollbars>
		</div>
	);
};

NoteList.propTypes = {
	onSelect: PropTypes.func.isRequired,
	filteredData: PropTypes.array.isRequired
};

export default NoteList;
