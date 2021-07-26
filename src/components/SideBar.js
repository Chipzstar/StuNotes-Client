import React, { useRef, useState } from 'react';
import { Dropdown, Overlay, Popover } from 'react-bootstrap';
import defaultProfile from '../assets/images/default profile.png';
import { signOutUser } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';
import { Link, NavLink, useHistory } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { IoEllipsisVerticalSharp } from 'react-icons/io5';
import { HOME_URL } from '../constants';
import '../stylesheets/App.css';

const SideBar = ({ width }) => {
	//hooks
	const user = useAuth();
	const history = useHistory();
	const { groups, notebooks, clearAll, removeNotebook, removeGroup } = useNotesStore();
	//state
	const [show, setShow] = useState(false);
	const [notebookId, setId] = useState(null);
	const [targetNotebook, setNotebookTarget] = useState(null);
	const [targetGroup, setGroupTarget] = useState(null);
	//refs
	const ref = useRef(null);

	const togglePopupMenu = (event, type, id) => {
		event.preventDefault();
		setShow(!show);
		setId(id)
		type === 'notebook' ? setNotebookTarget(event.target) : setGroupTarget(event.target);
	};

	return (
		<div
			className='offcanvas offcanvas-start'
			tabIndex='-1'
			id='offcanvasExample'
			data-bs-keyboard='false'
			data-bs-backdrop='false'
			aria-labelledby='offcanvasExampleLabel'
			style={{ width }}
		>
			<div className='offcanvas-header'>
				<div className='d-flex flex-column align-items-center flex-grow-1'>
					<Link to='/'>
						<img src={logo} width={50} height={50} alt='' className='rounded-circle' />
					</Link>
					<h4 className='offcanvas-title' id='offcanvasExampleLabel'>StuNotes</h4>
				</div>
				<button
					type='button'
					className='btn-close text-reset'
					data-bs-dismiss='offcanvas'
					aria-label='Close'
				/>
			</div>
			<div className='offcanvas-body d-flex flex-column flex-shrink-0 align-items-center pt-4 text-dark'>
				<ul className='list-unstyled ps-0'>
					<li className='mb-4'>
						<NavLink
							to={HOME_URL}
							className='btn-toggle align-items-center rounded collapsed text-decoration-none'
							role='button'
						>
							My Notes
						</NavLink>
					</li>
					<li className='mb-4'>
						<a
							href='#personal-notebook'
							className='btn-toggle align-items-center rounded collapsed text-decoration-none'
							data-bs-toggle='collapse'
							aria-expanded='false'
							aria-controls='personal-notebook'
							role='button'
						>
							Notebooks
						</a>
						<div id='personal-notebook' className='collapse'>
							<ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>
								{notebooks.map(({ id, name }, index) => index !== 0 && (
									<li key={id} tabIndex={1} onBlur={() => setShow(false)} ref={ref}>
										<NavLink
											to={`/notebooks/${name}`}
											className='link-dark rounded'
										>
											{name}
										</NavLink>
										<span role='button' onClick={(e) => togglePopupMenu(e, 'notebook')}>
											<IoEllipsisVerticalSharp size={14} />
										</span>
										<Overlay
											show={show}
											target={targetNotebook}
											placement='right'
											container={ref.current}
										>
											<Popover id='popover-contained'>
												<Popover.Body>
													<div className='menu'>
														<div
															className='dropdown-item'
															onMouseDown={(e) => e.preventDefault()}
															onClick={() => {
																alert("Renaming Notebook")
																setShow(false);
															}}>
															Rename
														</div>
														<div
															className='dropdown-item'
															onMouseDown={(e) => e.preventDefault()}
															onClick={() => removeNotebook(user.uid,  removeGroup(user.uid, id)
																.then(() => {
																	history.push(HOME_URL)
																	setShow(false);
																})
																.catch((err) => console.error(err)))
															}
															style={{ color: 'red' }}>Delete
														</div>
													</div>
												</Popover.Body>
											</Popover>
										</Overlay>
									</li>
								))}
							</ul>
						</div>
					</li>
					<li className='mb-4'>
						<a
							href='#group-notebook'
							className='btn-toggle align-items-center rounded collapsed text-decoration-none'
							data-bs-toggle='collapse'
							aria-expanded='false'
							aria-controls='group-notebook'
							role='button'
						>
							Group Notes
						</a>
						<div id='group-notebook' className='collapse'>
							<ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>
								{groups.map(({ id, name }) => (
									<li key={id} tabIndex={1} onBlur={() => setShow(false)} ref={ref}>
										<NavLink
											to={`/groups/${name}`}
											className='link-dark rounded'
										>
											{name}
										</NavLink>
										<span role='button' onClick={(e) => togglePopupMenu(e, 'group', id)}>
											<IoEllipsisVerticalSharp size={14} />
										</span>
										<Overlay
											target={targetGroup}
											show={show}
											placement='right'
											container={ref.current}
										>
											<Popover id='popover-contained'>
												<Popover.Body>
													<div className='menu'>
														<div
															className='dropdown-item'
															onMouseDown={(e) => e.preventDefault()}
															onClick={() => {
																alert("Renaming Notebook")
																setShow(false);
															}}>
															Rename
														</div>
														<div
															className='dropdown-item'
															onMouseDown={(e) => e.preventDefault()}
															onClick={() => removeGroup(user.uid, notebookId).then(() => {
																history.push(HOME_URL);
																setShow(false);
															})
																.catch(err => console.error(err))}
															style={{ color: 'red' }}>Delete
														</div>
													</div>
												</Popover.Body>
											</Popover>
										</Overlay>
									</li>
								))}
							</ul>
						</div>
					</li>
					<li className='mb-4'>
						<button className='btn-toggle align-items-center rounded collapsed'
						        data-bs-toggle='collapse'
						        data-bs-target='#orders-collapse' aria-expanded='false'>
								<span
									className='text-capitalize ms-1 d-xl-block d-lg-block d-md-block d-sm-none'>Trash</span>
						</button>
						<div className='collapse' id='orders-collapse'>
							<ul className='btn-toggle-nav list-unstyled fw-normal pb-1 small'>

							</ul>
						</div>
					</li>
				</ul>
				<div className='d-flex flex-column flex-grow-1 align-items-center justify-content-end w-100'>
					<hr className='my-2 divider w-100' />
					<Dropdown className='d-flex flex-column'>
						<Dropdown.Toggle
							drop='up'
							variant='link'
							size='sm'
							id='dropdown-basic'
							className='d-flex flex-column align-items-center bg'
						>
							<img src={defaultProfile} alt='profile' width={75} height={60}
							     className=' mt-3' />
							<span className='mx-1'>{user.displayName}</span>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item href='#/action-1'>Profile</Dropdown.Item>
							<Dropdown.Item href='#/action-2'>Settings</Dropdown.Item>
							<Dropdown.Item href='#/action-4' disabled>
								<hr className='dropdown-divider' />
							</Dropdown.Item>
							<Dropdown.Item onClick={() => signOutUser().then(() => clearAll())}>
								Sign out
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
