import React, { Component } from "react";
import Notes from '../assets/icons/notebook.svg'
import Transcribe from '../assets/icons/audio transcription.svg'
import Collab from '../assets/icons/collaborate.svg'
import "../stylesheets/App.css";

class Landing extends Component {
	render() {
		return (
			<div className="container-fluid bg-primary flex-1 py-5">
				<div className="jumbotron py-2 pb-5 px-5">
					<h1 className="display-3 font-weight-bold">Welcome to StuNotes</h1>
					<hr className="my-2" />
					<p className="lead" >
						A simple application for School / University students to collaborate together on notes
					</p>
					{/*<p className="py-4 d-flex">
						<a
							className="btn btn-lg bg-success"
							href="#!"
							role="button"
						>
							Register now!
						</a>
					</p>*/}
				</div>
				<div className="row">
					<div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 px-3'>
						<div className='d-flex flex-row justify-content-center icon-container'>
							<img
								className='img-fluid'
								src={Notes}
								width={200}
								height={200}
								alt='Notes'
							/>
						</div>
						<div className='p-5 d-flex flex-column align-items-center'>
							<h4 className='font-weight-bold mb-3'>Organised Notes</h4>
							<p className='px-0 text-center'>
								View, edit and create notes with ease.
								Notes can be organised into folders and labelled with custom tags
							</p>
						</div>
					</div>
					<div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 px-3'>
						<div className='d-flex flex-row justify-content-center icon-container'>
							<img
								className='img-fluid'
								src={Collab}
								width={200}
								height={200}
								alt='handshake'
							/>
						</div>
						<div className='p-5 d-flex flex-column align-items-center'>
							<h4 className='font-weight-bold mb-3'>Real-time collaboration</h4>
							<p className='px-0 text-center'>
								Collaborate with classmates through real-time shared editing of documents,
								including support for offline editing and in-line comments
							</p>
						</div>
					</div>
					<div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 px-3'>
						<div className='d-flex flex-row justify-content-center icon-container'>
							<img
								className='img-fluid'
								src={Transcribe}
								width={200}
								height={200}
								alt='audio transcription'
							/>
						</div>
						<div className='p-5 d-flex flex-column align-items-center'>
							<h4 className='font-weight-bold mb-3'>Audio Transcription</h4>
							<p className='px-0 text-center'>
								Upload your lecture recordings to transcribe it's audio into readable text,
								and use as reference for your lecture notes!
							</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Landing.propTypes = {};

export default Landing;
