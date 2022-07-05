import Ajv from 'ajv';

const ajv = new Ajv({
	coerceTypes: true,
});

export type E2ESetUserPublicAndPrivateKeysParamsPOST = {
	public_key: string;
	private_key: string;
};

const e2eSetUserPublicAndPrivateKeysParamsPOSTSchema = {
	type: 'object',
	properties: {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		public_key: {
			type: 'string',
		},
		// eslint-disable-next-line @typescript-eslint/naming-convention
		private_key: {
			type: 'string',
		},
	},
	additionalProperties: false,
	required: ['public_key', 'private_key'],
};

export const ise2eSetUserPublicAndPrivateKeysParamsPOST = ajv.compile<E2ESetUserPublicAndPrivateKeysParamsPOST>(
	e2eSetUserPublicAndPrivateKeysParamsPOSTSchema,
);
