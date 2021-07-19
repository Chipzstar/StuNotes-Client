import React, { useEffect, useMemo } from 'react';
import { useNotesStore } from '../store';
import { useParams } from 'react-router-dom';
import { COLOURS } from '../constants';
import { useMeasure } from 'react-use';
import HorizontalScrollbar from './HorizontalScrollbar';

const MembersContainer = props => {
	const { groups } = useNotesStore();
	const { group: GROUP, id: ID } = useParams();
	const [ref, { width: outerDivWidth }] = useMeasure();

	const members = useMemo(() => GROUP ? groups.find(group => group.name === GROUP).members : [], [groups, GROUP]);

	useEffect(() => {
		console.log('Members:', members);
	}, [ID, members]);

	return (
		<div className='d-flex'>
			<HorizontalScrollbar
				autoHeight
				autoHide
				renderTrackHorizontal={props => <div {...props} className='track-horizontal' />}
				renderThumbHorizontal={props => <div {...props} className='thumb-horizontal' />}
				renderView={props => <div {...props} className='view' style={{ overflowY: 'hidden' }} />}
			>
				<ul className='list-group list-group-horizontal text-center' ref={ref}>
					{members.map(({ id, name, email }, index) => (
						<li key={id} className='d-flex justify-content-center align-items-center list-group-item rounded-circle border border-4 border-dark me-4'
						    style={{
							    backgroundColor: COLOURS[index],
							    width: 150,
							    height: 150
						    }}>
							<span className='fw-bold lead'>{name}</span>
						</li>
					))}
				</ul>
			</HorizontalScrollbar>
		</div>
	);
};

MembersContainer.propTypes = {};

export default MembersContainer;
