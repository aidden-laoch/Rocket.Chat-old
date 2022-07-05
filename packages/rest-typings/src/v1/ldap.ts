import Ajv from 'ajv';

const ajv = new Ajv({
	coerceTypes: true,
});

type LDAPTestSearchProps = {
	username: string;
};

const ldapTestSearchPropsSchema = {
	type: 'object',
	properties: {
		username: {
			type: 'string',
		},
	},
	required: ['username'],
	additionalProperties: false,
};

export const isLdapTestSearch = ajv.compile<LDAPTestSearchProps>(ldapTestSearchPropsSchema);

export type LDAPEndpoints = {
	'/v1/ldap.testConnection': {
		POST: () => {
			message: string;
		};
	};
	'/v1/ldap.testSearch': {
		POST: (params: LDAPTestSearchProps) => {
			message: string;
		};
	};
	'/v1/ldap.syncNow': {
		POST: () => {
			message: string;
		};
	};
};
