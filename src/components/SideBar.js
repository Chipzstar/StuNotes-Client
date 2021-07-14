import React, { useRef, useState } from 'react';
import { Dropdown, Overlay, Popover } from 'react-bootstrap';
import defaultProfile from '../assets/images/default profile.png';
import { signOutUser } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useNotesStore } from '../store';
import { Link, NavLink, withRouter } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import '../stylesheets/App.css';

const SideBar = ({ width }, ...props) => {
	const user = useAuth();
	const [show, setShow] = useState(false);
	const [target, setTarget] = useState(null);
	const ref = useRef(null);
	const { notebooks, clearNotes, removeNotebook, renameNotebook } = useNotesStore();

	const togglePopupMenu = (event) => {
		event.preventDefault();
		setShow(!show);
		setTarget(event.target);
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
				<button type='button' className='btn-close text-reset' data-bs-dismiss='offcanvas'
				        aria-label='Close' />
			</div>
			<div className='offcanvas-body d-flex flex-column flex-shrink-0 align-items-center pt-4 text-dark'>
				<ul className='list-unstyled ps-0'>
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
								{notebooks.map(({ id, name }) => (
									<li key={id} ref={ref} onBlur={() => setShow(false)}>
										<NavLink
											to={`/${name}`}
											className='link-dark rounded'
											onContextMenu={togglePopupMenu}>
											{name}
										</NavLink>
										<Overlay
											show={show}
											target={target}
											placement='right'
											container={ref.current}
										>
											<Popover id='popover-contained'>
												<Popover.Body>
													<div className='menu'>
														<div
															className='dropdown-item'
															onMouseDown={(e) => e.preventDefault()}
															onClick={() => renameNotebook(user.uid, id, "Notebook 1")}>
															Rename
														</div>
														<div
															className='dropdown-item'
															onMouseDown={(e) => e.preventDefault()}
															onClick={() => {
																props.history.push('/')
																removeNotebook(user.uid, id)
																setShow(false);
															}}
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
								<li><a href='#' className='link-dark rounded'>Overview</a></li>
								<li><a href='#' className='link-dark rounded'>Weekly</a></li>
								<li><a href='#' className='link-dark rounded'>Monthly</a></li>
								<li><a href='#' className='link-dark rounded'>Annually</a></li>
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
				{/*<ul className='nav nav-pills flex-column mb-sm-auto mb-auto' id='menu'>
				<li className='nav-item mt-4'>
					<Link to="/notes" className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Notes} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Notes</span>
					</Link>
				</li>
				<li className='nav-item mt-4'>
					<Link to="/groups"
					   className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Team} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Teams</span>
					</Link>
				</li>
				<li className='nav-item mt-4'>
					<a href='#'
					   className='nav-link align-middle px-0 d-flex flex-row justify-content-center'>
						<img src={Trash} alt='' width={50} height={50} className='img-fluid' />
						<span className='ps-4 h1 text-capitalize ms-1 d-none'>Trash</span>
					</a>
				</li>
			</ul>*/}
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
							<Dropdown.Item onClick={() => signOutUser().then(() => clearNotes())}>Sign
								out</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
				</div>
			</div>
		</div>
	);
};

export default withRouter(SideBar);
