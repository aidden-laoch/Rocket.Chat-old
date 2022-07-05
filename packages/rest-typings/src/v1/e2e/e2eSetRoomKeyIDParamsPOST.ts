import Ajv from 'ajv';

const ajv = new Ajv({
	coerceTypes: true,
});

export type E2ESetRoomKeyIDParamsPOST = {
	rid: string;
	keyID: string;
};

const e2eSetRoomKeyIDParamsPOSTSchema = {
	type: 'object',
	properties: {
		rid: {
			type: 'string',
		},
		keyID: {
			type: 'string',
		},
	},
	additionalProperties: false,
	required: ['rid', 'keyID'],
};

export const ise2eSetRoomKeyIDParamsPOST = ajv.compile<E2ESetRoomKeyIDParamsPOST>(e2eSetRoomKeyIDParamsPOSTSchema);
