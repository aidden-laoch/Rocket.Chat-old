import { Page, test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { HomeChannel, Auth } from './page-objects';

test.describe.only('Channel Management', () => {
	let page: Page;
	let pageAuth: Auth;
	let pageHomeChannel: HomeChannel;

	let anyChannel: string;
	let anyUser: string;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		pageAuth = new Auth(page);
		pageHomeChannel = new HomeChannel(page);

		anyChannel = faker.animal.type() + Date.now();
		anyUser = 'rocket.cat';
	});

	test.beforeAll(async () => {
		await pageAuth.doLogin();
		await pageHomeChannel.sidebar.doCreateChannel(anyChannel);
	});

	test('expect find channel "anyChannel"', async () => {
		await pageHomeChannel.sidebar.btnSearch.click();
		await pageHomeChannel.sidebar.inputSearch.type(anyChannel);
		await pageHomeChannel.sidebar.getSearchResultByName(anyChannel).click();

		await expect(page).toHaveURL(`/channel/${anyChannel}`);
	});

	test('expect add user into "anyChannel"', async () => {
		await pageHomeChannel.tabs.btnMembers.click();
		await pageHomeChannel.tabs.btnAddMember.click();
		await pageHomeChannel.tabs.inputChooseMember.type(anyUser);
		await page.waitForTimeout(3000);
		await pageHomeChannel.tabs.firstOptionChooseMember.click();
		await pageHomeChannel.tabs.btnAddChosenMember.click();

		await expect(pageHomeChannel.tabs.getMember(anyUser)).toBeVisible();
	});

	test('expect open "anyChannel" tab info edit', async () => {
		await pageHomeChannel.tabs.btnChannelInfo.click();
		await pageHomeChannel.tabs.btnChannelInfoEdit.click();

		await expect(page).toHaveURL(`/channel/${anyChannel}/channel-settings`);
	});

	test('expect update "anyChannel" name to "newName"', async () => {
		const newName = 'NAME EDITED';

		await pageHomeChannel.tabs.inputChannelName.type(newName);
		await pageHomeChannel.tabs.btnEditSave.click();
		await pageHomeChannel.sidebar.doOpenChat(newName);

		await expect(page).toHaveURL(`/channel/${anyChannel}`);
	});

	test('expect update "anyChannel" announcement to "newAnnouncement"', async () => {
		const newAnnouncement = 'ANNOUNCEMENT EDITED';

		await pageHomeChannel.tabs.inputChannelAnnouncement.type(newAnnouncement);
		await pageHomeChannel.tabs.btnEditSave.click();

		await expect(pageHomeChannel.content.announcementTitle).toHaveText(newAnnouncement);
	});

	test('expect update channel description to "newDescription"', async () => {
		const newDescription = 'NEW DESCRIPTION';

		await pageHomeChannel.tabs.inputChannelDescription.type(newDescription);
		await pageHomeChannel.tabs.btnEditSave.click();

		await expect(pageHomeChannel.content.getSystemMessage(newDescription)).toBeVisible();
	});

	test('expect open "anyChannel" member info', async () => {
		await pageHomeChannel.tabs.btnMembers.click();
		await pageHomeChannel.tabs.getMember(anyUser).click();

		await expect(page).toHaveURL(`/channel/${anyChannel}/members-list`);
	});

	test('expect mute "anyUser"', async () => {
		await pageHomeChannel.tabs.memberInfoMenu.click();
		await pageHomeChannel.tabs.btnMuteMember.click();
		await pageHomeChannel.btnModalCancel.click();

		await expect(pageHomeChannel.content.getSystemMessage(anyUser)).toBeVisible();
	});

	test('expect unmute "anyUser"', async () => {
		await pageHomeChannel.tabs.memberInfoMenu.click();
		await pageHomeChannel.tabs.btnMuteMember.click();

		await expect(pageHomeChannel.content.getSystemMessage(anyUser)).toBeVisible();
	});

	test('expect set "anyUser" as owner', async () => {
		await pageHomeChannel.tabs.btnSetMemberOwner.click();

		await expect(pageHomeChannel.content.getSystemMessage(anyUser)).toBeVisible();
	});
});
