import React from 'react';
import { signOutUser } from '../firebase';

const Settings = () => {
	return (
		<div className='container py-5'>
			<div className='row justify-content-center text-center'>
				<div className='col mb-5'>
					<h1 className='display-4'>Settings</h1>
				</div>
			</div>
			<div className='row justify-content-center text-center'>
				<div className='col'>
					<button className='btn btn-lg btn-primary' onClick={() => signOutUser()}>Sign Out</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;