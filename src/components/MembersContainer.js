import React from 'react';
import { COLOURS } from '../constants';
import { useMeasure } from 'react-use';
import PropTypes from 'prop-types';
import HorizontalScrollbar from './HorizontalScrollbar';

const MembersContainer = ({ members }) => {
	const [ref, { width: outerDivWidth }] = useMeasure();

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
							    width: 120,
							    height: 120
						    }}>
							<span className='fw-bold lead'>{name}</span>
						</li>
					))}
				</ul>
			</HorizontalScrollbar>
		</div>
	);
};

MembersContainer.propTypes = {
	members: PropTypes.array.isRequired
};

export default MembersContainer;
