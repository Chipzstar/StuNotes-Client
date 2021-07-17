import React, { useMemo } from 'react';
import { useNotesStore } from '../store';
import { useParams } from 'react-router-dom';
import { COLOURS } from '../constants';

const MembersContainer = props => {
	const { groups } = useNotesStore()
	const { group: GROUP } = useParams();

	const members = useMemo(() => GROUP ? groups.find(group => group.name === GROUP).members : [], []);

	return (
		<div className="d-flex">
			<span>Members</span>
			<div className='d-flex fkex-row justify-content-center'>
				{members.map((name, index) => (
					<div className="rounded-circle" style={{backgroundColor: COLOURS[index]}}>
						<span>{name}</span>
					</div>
				))}
			</div>
		</div>
	);
};

MembersContainer.propTypes = {

};

export default MembersContainer;
