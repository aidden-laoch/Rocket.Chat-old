import { Box } from '@rocket.chat/fuselage';
import React, { ComponentProps, FC } from 'react';

const Label: FC<ComponentProps<typeof Box>> = (props) => (
	<Box fontScale='p2' color='default' {...props} />
);

export default Label;
