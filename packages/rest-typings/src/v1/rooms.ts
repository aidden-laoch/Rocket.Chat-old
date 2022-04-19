import type { IMessage } from "@rocket.chat/core-typings";
import type { IRoom } from "@rocket.chat/core-typings";
import type { IUser } from "@rocket.chat/core-typings";

export type RoomsEndpoints = {
  "rooms.autocomplete.channelAndPrivate": {
    GET: (params: { selector: string }) => {
      items: IRoom[];
    };
  };
  "rooms.autocomplete.channelAndPrivate.withPagination": {
    GET: (params: {
      selector: string;
      offset?: number;
      count?: number;
      sort?: string;
    }) => {
      items: IRoom[];
      count: number;
      offset: number;
      total: number;
    };
  };
  "rooms.autocomplete.availableForTeams": {
    GET: (params: { name: string }) => {
      items: IRoom[];
    };
  };
  "rooms.info": {
    GET: (params: { roomId: string } | { roomName: string }) => {
      room: IRoom;
    };
  };
  "rooms.createDiscussion": {
    POST: (params: {
      prid: IRoom["_id"];
      pmid?: IMessage["_id"];
      t_name: IRoom["fname"];
      users?: IUser["username"][];
      encrypted?: boolean;
      reply?: string;
    }) => {
      discussion: IRoom;
    };
  };
	'/v1/rooms.export': {
		POST: {
			(
				params:
					| {
							rid: IRoom['_id'];
							type: 'file';
							dateFrom?: string;
							dateTo?: string;
							format: 'html' | 'json';
					  }
					| {
							rid: IRoom['_id'];
							type: 'email';
							toUsers: string[];
							toEmails: string[];
							subject: string;
							messages: string[];
					  },
			): {
				missing: string[];
			} | void;
		};
	};
};
