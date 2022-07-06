import { Page, test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

import { HomeChannel, Auth } from './page-objects';

const getNewUser = (): { name: string; email: string; password: string } => {
	return { name: faker.name.firstName(), email: faker.internet.email(), password: 'any_password' };
};

test.describe('Messaging', () => {
	let page: Page;
	let pageAuth: Auth;
	let pageHomeChannel: HomeChannel;

	let page2: Page;
	let pageAuth2: Auth;
	let pageHomeChannel2: HomeChannel;

	let newChannel: string;

	test.beforeAll(async ({ browser }) => {
		page = await browser.newPage();
		pageAuth = new Auth(page);
		pageHomeChannel = new HomeChannel(page);

		page2 = await browser.newPage();
		pageAuth2 = new Auth(page2);
		pageHomeChannel2 = new HomeChannel(page2);
	});

	test.beforeAll(async () => {
		await pageAuth.doLogin();
		newChannel = `NEWCHANNEL${Date.now()}`;
		await pageHomeChannel.sidebar.doCreateChannel(newChannel, false);

		const newUser = getNewUser();
		await pageAuth2.doRegister(newUser);
		await pageHomeChannel2.sidebar.doOpenChat(newChannel);
	});

	test('expect start chat', async () => {
		await pageHomeChannel.content.doSendMessage('HI');
		await pageHomeChannel2.content.doSendMessage('HI');

		await expect(pageHomeChannel.content.lastUserMessage).toBeVisible();
		await expect(pageHomeChannel2.content.lastUserMessage).toBeVisible();
	});

	test('expect send file to user', async () => {
		await pageHomeChannel.content.doDropFileInChat();
		await pageHomeChannel.btnModalConfirm.click();
		await expect(pageHomeChannel2.content.lastUserMessage).toBeVisible();
	});

	test('expect send file with description', async () => {
		await pageHomeChannel.content.doDropFileInChat();
		await pageHomeChannel.inputFileDescription.type('any_description');
		await pageHomeChannel.btnModalConfirm.click();
		await expect(pageHomeChannel2.content.lastUserMessage).toBeVisible();
	});

	test('expect send file with different file name', async () => {
		await pageHomeChannel.content.doDropFileInChat();
		await pageHomeChannel.inputFileName.fill('new_file-name.txt');
		await pageHomeChannel.btnModalConfirm.click();
		await expect(pageHomeChannel2.content.lastUserMessage).toBeVisible();
	});

	test('expect send file with different file name and description', async () => {
		await pageHomeChannel.content.doDropFileInChat();
		await pageHomeChannel.inputFileName.fill('new_file-name.txt');
		await pageHomeChannel.inputFileDescription.type('any_description');
		await pageHomeChannel.btnModalConfirm.click();
		await expect(pageHomeChannel2.content.lastUserMessage).toBeVisible();
	});
});
