import { Page, test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { HomeChannel, Auth } from './page-objects';

test.describe.only('Channel Management', () => {
	let page: Page;
	let pageAuth: Auth;
	let pageHomeChannel: HomeChannel;
	let channelName: string;
	let userName: string;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		pageAuth = new Auth(page);
		pageHomeChannel = new HomeChannel(page);
		channelName = faker.animal.type() + Date.now();
		userName = 'rocket.cat';
	});

	test.beforeAll(async () => {
		await pageAuth.doLogin();
		await pageHomeChannel.sidebar.doCreateChannel(channelName);
		await page.goto('/');
	});

	test('expect find channel "channelName"', async () => {
		await pageHomeChannel.sidebar.btnSearch.click();
		await pageHomeChannel.sidebar.inputSearch.type(channelName);
		await pageHomeChannel.sidebar.getSearchResultByName(channelName).click();

		await expect(page).toHaveURL(`/channel/${channelName}`);
	});

	test('expect add user into channel "channelName"', async () => {
		await pageHomeChannel.tabs.btnMembers.click();
		await pageHomeChannel.tabs.btnAddMember.click();
		await pageHomeChannel.tabs.inputChooseMember.type(userName);
		await page.waitForTimeout(3000);
		await pageHomeChannel.tabs.firstOptionChooseMember.click();
		await pageHomeChannel.tabs.btnAddChosenMember.click();

		await expect(pageHomeChannel.tabs.getMember(userName)).toBeVisible();
	});

	test('expect open channel tab info edit', async () => {
		await pageHomeChannel.tabs.btnChannelInfo.click();
		await pageHomeChannel.tabs.btnChannelInfoEdit.click();

		await expect(page).toHaveURL(`/channel/${channelName}/channel-settings`);
	});

	test('expect update channel announcement to "newAnnouncement"', async () => {
		const newAnnouncement = 'ANNOUNCEMENT EDITED';

		await pageHomeChannel.tabs.inputChannelAnnouncement.type(newAnnouncement);
		await pageHomeChannel.tabs.btnEditSave.click();

		await expect(pageHomeChannel.content.announcementTitle).toBeVisible();
	});

	test('expect update channel description to "newDescription"', async () => {
		const newDescription = 'NEW DESCRIPTION';

		await pageHomeChannel.tabs.inputChannelDescription.type(newDescription);
		await pageHomeChannel.tabs.btnEditSave.click();

		await expect(pageHomeChannel.content.getSystemMessage(newDescription)).toBeVisible();
	});

	test('expect open channel member info', async () => {
		await pageHomeChannel.tabs.btnMembers.click();
		await pageHomeChannel.tabs.getMember(userName).click();

		await expect(page).toHaveURL(`/channel/${channelName}/members-list`);
	});

	test('expect mute user', async () => {
		await pageHomeChannel.tabs.memberInfoMenu.click();
		await pageHomeChannel.tabs.btnMuteMember.click();
		await pageHomeChannel.btnModalCancel.click();

		await expect(pageHomeChannel.content.getSystemMessage(userName)).toBeVisible();
	});

	test('expect unmute user', async () => {
		await pageHomeChannel.tabs.memberInfoMenu.click();
		await pageHomeChannel.tabs.btnMuteMember.click();
		await expect(pageHomeChannel.content.getSystemMessage(userName)).toBeVisible();
	});

	test('expect set user as owner', async () => {
		await pageHomeChannel.tabs.btnSetMemberOwner.click();
		await expect(pageHomeChannel.content.getSystemMessage(userName)).toBeVisible();
	});
});
