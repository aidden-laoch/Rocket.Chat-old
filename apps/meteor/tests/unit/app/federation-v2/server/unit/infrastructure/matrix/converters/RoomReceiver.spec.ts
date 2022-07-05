import { expect } from 'chai';
import { RoomType } from '@rocket.chat/apps-engine/definition/rooms';

import { MatrixRoomReceiverConverter } from '../../../../../../../../../app/federation-v2/server/infrastructure/matrix/converters/RoomReceiver';
import {
	FederationRoomCreateInputDto,
	FederationRoomChangeMembershipDto,
	FederationRoomSendInternalMessageDto,
} from '../../../../../../../../../app/federation-v2/server/application/input/RoomReceiverDto';
import { MatrixEventType } from '../../../../../../../../../app/federation-v2/server/infrastructure/matrix/definitions/MatrixEventType';
import { RoomJoinRules } from '../../../../../../../../../app/federation-v2/server/infrastructure/matrix/definitions/IMatrixEventContent/IMatrixEventContentSetRoomJoinRules';
import { AddMemberToRoomMembership } from '../../../../../../../../../app/federation-v2/server/infrastructure/matrix/definitions/IMatrixEventContent/IMatrixEventContentAddMemberToRoom';
import { EVENT_ORIGIN } from '../../../../../../../../../app/federation-v2/server/domain/IFederationBridge';

describe('Federation - Infrastructure - Matrix - MatrixRoomReceiverConverter', () => {
	describe('#toRoomCreateDto()', () => {
		const event = {
			content: { was_internally_programatically_created: true, name: 'roomName' },
			room_id: '!roomId:matrix.org',
			sender: '@marcos.defendi:matrix.org',
		};

		it('should return an instance of FederationRoomCreateInputDto', () => {
			expect(MatrixRoomReceiverConverter.toRoomCreateDto({} as any)).to.be.instanceOf(FederationRoomCreateInputDto);
		});

		it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
			const result = MatrixRoomReceiverConverter.toRoomCreateDto({ room_id: event.room_id } as any);
			expect(result.externalRoomId).to.be.equal('!roomId:matrix.org');
			expect(result.normalizedRoomId).to.be.equal('roomId');
		});

		it('should return the external room name and room type when the room state is present on the event and it has the correct events', () => {
			const state = [
				{ type: MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
				{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.JOIN } },
			];
			const result = MatrixRoomReceiverConverter.toRoomCreateDto({ unsigned: { invite_room_state: state } } as any);
			expect(result.externalRoomName).to.be.equal(event.content.name);
			expect(result.roomType).to.be.equal(RoomType.CHANNEL);
		});

		it('should convert to the expected (private) room type when the join rule is equal to INVITE', () => {
			const state = [
				{ type: MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
				{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.INVITE } },
			];
			const result = MatrixRoomReceiverConverter.toRoomCreateDto({ unsigned: { invite_room_state: state } } as any);
			expect(result.externalRoomName).to.be.equal(event.content.name);
			expect(result.roomType).to.be.equal(RoomType.PRIVATE_GROUP);
		});

		it('should convert to the expected (channel) room type when the join rule is equal to JOIN', () => {
			const state = [{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.JOIN } }];
			const result = MatrixRoomReceiverConverter.toRoomCreateDto({ invite_room_state: state } as any);
			expect(result.roomType).to.be.equal(RoomType.CHANNEL);
		});

		it('should convert the inviter id to the a rc-format like (without any @ in it)', () => {
			const result = MatrixRoomReceiverConverter.toRoomCreateDto({ sender: event.sender } as any);
			expect(result.normalizedInviterId).to.be.equal('marcos.defendi:matrix.org');
		});

		it('should set wasInternallyProgramaticallyCreated accordingly to the event', () => {
			const result = MatrixRoomReceiverConverter.toRoomCreateDto({ content: event.content } as any);
			expect(result.wasInternallyProgramaticallyCreated).to.be.true;
		});

		it('should convert the event properly', () => {
			const result = MatrixRoomReceiverConverter.toRoomCreateDto(event as any);
			expect(result).to.be.eql({
				externalRoomId: '!roomId:matrix.org',
				normalizedRoomId: 'roomId',
				externalInviterId: '@marcos.defendi:matrix.org',
				normalizedInviterId: 'marcos.defendi:matrix.org',
				wasInternallyProgramaticallyCreated: true,
			});
		});
	});

	describe('#toChangeRoomMembershipDto()', () => {
		const event = {
			content: { name: 'roomName' },
			room_id: '!roomId:matrix.org',
			sender: '@marcos.defendi:matrix.org',
			state_key: '@marcos.defendi2:matrix.org',
		};

		it('should return an instance of FederationRoomChangeMembershipDto', () => {
			expect(MatrixRoomReceiverConverter.toChangeRoomMembershipDto({} as any, 'domain')).to.be.instanceOf(
				FederationRoomChangeMembershipDto,
			);
		});

		it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ room_id: event.room_id } as any, 'domain');
			expect(result.externalRoomId).to.be.equal('!roomId:matrix.org');
			expect(result.normalizedRoomId).to.be.equal('roomId');
		});

		it('should return the external room name and room type when the room state is present on the event and it has the correct events', () => {
			const state = [
				{ type: MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
				{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.JOIN } },
			];
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ unsigned: { invite_room_state: state } } as any, 'domain');
			expect(result.externalRoomName).to.be.equal(event.content.name);
			expect(result.roomType).to.be.equal(RoomType.CHANNEL);
		});

		it('should convert to the expected (private) room type when the join rule is equal to INVITE', () => {
			const state = [
				{ type: MatrixEventType.ROOM_NAME_CHANGED, content: { name: event.content.name } },
				{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.INVITE } },
			];
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ unsigned: { invite_room_state: state } } as any, 'domain');
			expect(result.externalRoomName).to.be.equal(event.content.name);
			expect(result.roomType).to.be.equal(RoomType.PRIVATE_GROUP);
		});

		it('should convert to the expected (channel) room type when the join rule is equal to JOIN', () => {
			const state = [{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.JOIN } }];
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ invite_room_state: state } as any, 'domain');
			expect(result.roomType).to.be.equal(RoomType.CHANNEL);
		});

		it('should convert to the expected (direct) room type when the join rule is equal to INVITE and its a direct message', () => {
			const state = [{ type: MatrixEventType.ROOM_JOIN_RULES_CHANGED, content: { join_rule: RoomJoinRules.INVITE } }];
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto(
				{
					invite_room_state: state,
					content: { is_direct: true },
				} as any,
				'domain',
			);
			expect(result.roomType).to.be.equal(RoomType.DIRECT_MESSAGE);
		});

		it('should convert the inviter id to the a rc-format like (without any @ in it)', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: event.sender } as any, 'domain');
			expect(result.normalizedInviterId).to.be.equal('marcos.defendi:matrix.org');
		});

		it('should convert the invitee id to the a rc-format like (without any @ in it)', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ state_key: event.sender } as any, 'domain');
			expect(result.normalizedInviteeId).to.be.equal('marcos.defendi:matrix.org');
		});

		it('should convert the inviter id to the a rc-format username like (without any @ in it and just the part before the ":")', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: event.sender } as any, 'domain');
			expect(result.inviterUsernameOnly).to.be.equal('marcos.defendi');
		});

		it('should convert the invitee id to the a rc-format username like (without any @ in it and just the part before the ":")', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ state_key: event.sender } as any, 'domain');
			expect(result.inviteeUsernameOnly).to.be.equal('marcos.defendi');
		});

		it('should set leave to true if its a LEAVE event', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto(
				{
					content: { membership: AddMemberToRoomMembership.LEAVE },
				} as any,
				'domain',
			);
			expect(result.leave).to.be.true;
		});

		it('should set leave to false if its NOT a LEAVE event', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto(
				{
					content: { membership: AddMemberToRoomMembership.JOIN },
				} as any,
				'domain',
			);
			expect(result.leave).to.be.false;
		});

		it('should set the event origin as REMOTE if the inviter is from a different home server', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: 'a:matrix.org' } as any, 'domain');
			expect(result.eventOrigin).to.be.equal(EVENT_ORIGIN.REMOTE);
		});

		it('should set the event origin as LOCAL if the inviter is NOT different home servers', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto({ sender: 'a:domain' } as any, 'domain');
			expect(result.eventOrigin).to.be.equal(EVENT_ORIGIN.LOCAL);
		});

		it('should convert the event properly', () => {
			const result = MatrixRoomReceiverConverter.toChangeRoomMembershipDto(event as any, 'domain');
			expect(result).to.be.eql({
				externalRoomId: '!roomId:matrix.org',
				normalizedRoomId: 'roomId',
				externalInviterId: '@marcos.defendi:matrix.org',
				normalizedInviterId: 'marcos.defendi:matrix.org',
				externalInviteeId: '@marcos.defendi2:matrix.org',
				normalizedInviteeId: 'marcos.defendi2:matrix.org',
				inviteeUsernameOnly: 'marcos.defendi2',
				inviterUsernameOnly: 'marcos.defendi',
				eventOrigin: EVENT_ORIGIN.REMOTE,
				leave: false,
			});
		});
	});

	describe('#toSendRoomMessageDto()', () => {
		const event = {
			content: { body: 'msg' },
			room_id: '!roomId:matrix.org',
			sender: '@marcos.defendi:matrix.org',
		};

		it('should return an instance of FederationRoomSendInternalMessageDto', () => {
			expect(MatrixRoomReceiverConverter.toSendRoomMessageDto({} as any)).to.be.instanceOf(FederationRoomSendInternalMessageDto);
		});

		it('should return the basic room properties correctly (normalizedRoomId without any "!" and only the part before the ":") if any', () => {
			const result = MatrixRoomReceiverConverter.toSendRoomMessageDto({ room_id: event.room_id } as any);
			expect(result.externalRoomId).to.be.equal('!roomId:matrix.org');
			expect(result.normalizedRoomId).to.be.equal('roomId');
		});

		it('should convert the sender id to the a rc-format like (without any @ in it)', () => {
			const result = MatrixRoomReceiverConverter.toSendRoomMessageDto({ sender: event.sender } as any);
			expect(result.normalizedSenderId).to.be.equal('marcos.defendi:matrix.org');
		});

		it('should convert the event properly', () => {
			const result = MatrixRoomReceiverConverter.toSendRoomMessageDto(event as any);
			expect(result).to.be.eql({
				externalRoomId: '!roomId:matrix.org',
				normalizedRoomId: 'roomId',
				externalSenderId: '@marcos.defendi:matrix.org',
				normalizedSenderId: 'marcos.defendi:matrix.org',
				text: 'msg',
			});
		});
	});
});
