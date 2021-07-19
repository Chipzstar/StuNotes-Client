import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

const HorizontalScrollbar = ({  autoHide, autoHeight, renderThumbHorizontal, renderTrackHorizontal, renderView, ...props }) => {
	return (
		<Scrollbars
			autoHeight={autoHeight}
			autoHide={autoHide}
			renderView={renderView}
			renderTrackHorizontal={renderTrackHorizontal}
			renderThumbHorizontal={renderThumbHorizontal}
		>
			{props.children}
		</Scrollbars>
	);
};

export default HorizontalScrollbar;
