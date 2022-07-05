import Ajv from 'ajv';

const ajv = new Ajv({
	coerceTypes: true,
});

export type E2EGetUsersOfRoomWithoutKeyParamsGET = {
	rid: string;
};

const e2eGetUsersOfRoomWithoutKeyParamsGETSchema = {
	type: 'object',
	properties: {
		rid: {
			type: 'string',
		},
	},
	additionalProperties: false,
	required: ['rid'],
};

export const ise2eGetUsersOfRoomWithoutKeyParamsGET = ajv.compile<E2EGetUsersOfRoomWithoutKeyParamsGET>(
	e2eGetUsersOfRoomWithoutKeyParamsGETSchema,
);
