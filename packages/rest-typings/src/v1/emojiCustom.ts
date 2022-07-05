import type { ICustomEmojiDescriptor, IEmojiCustom } from '@rocket.chat/core-typings';
import Ajv from 'ajv';

import type { PaginatedRequest } from '../helpers/PaginatedRequest';
import type { PaginatedResult } from '../helpers/PaginatedResult';

const ajv = new Ajv({
	coerceTypes: true,
});

type EmojiCustomDeleteProps = {
	emojiId: ICustomEmojiDescriptor['_id'];
};

const emojiCustomDeletePropsSchema = {
	type: 'object',
	properties: {
		emojiId: {
			type: 'string',
		},
	},
	required: ['emojiId'],
	additionalProperties: false,
};

export const isEmojiCustomDelete = ajv.compile<EmojiCustomDeleteProps>(emojiCustomDeletePropsSchema);

type EmojiCustomList = {
	query: string;
	updatedSince?: string;
};

const emojiCustomListSchema = {
	type: 'object',
	properties: {
		query: {
			type: 'string',
		},
		updatedSince: {
			type: 'string',
			nullable: true,
		},
	},
	required: ['query'],
	additionalProperties: false,
};

export const isEmojiCustomList = ajv.compile<EmojiCustomList>(emojiCustomListSchema);

export type EmojiCustomEndpoints = {
	'/v1/emoji-custom.all': {
		GET: (params: PaginatedRequest<{ query: string }, 'name'>) => PaginatedResult<{
			emojis: IEmojiCustom[];
		}>;
	};
	'/v1/emoji-custom.list': {
		GET: (params: EmojiCustomList) => {
			emojis: {
				update: IEmojiCustom[];
				remove: IEmojiCustom[];
			};
		};
	};
	'/v1/emoji-custom.delete': {
		POST: (params: EmojiCustomDeleteProps) => void;
	};
	'/v1/emoji-custom.create': {
		POST: (params: { emoji: ICustomEmojiDescriptor }) => void;
	};
	'/v1/emoji-custom.update': {
		POST: (params: { emoji: ICustomEmojiDescriptor }) => void;
	};
};
