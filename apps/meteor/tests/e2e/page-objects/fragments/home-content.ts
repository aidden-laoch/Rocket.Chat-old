import { Page, Locator } from '@playwright/test';

export class HomeContent {
	private readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	get inputMessage(): Locator {
		return this.page.locator('[name="msg"]');
	}

	get popupMessage(): Locator {
		return this.page.locator('.message-popup');
	}

	get announcementTitle(): Locator {
		return this.page.locator('[data-qa="AnnouncementAnnoucementComponent"]');
	}

	getSystemMessage(text: string): Locator {
		return this.page.locator(`[data-qa-type="system-message-body"] >> text="${text}"`).last();
	}

	async doSetInputMessage(input: { text: string; delay?: number }): Promise<void> {
		await this.inputMessage.click({ clickCount: 3 });
		await this.page.keyboard.press('Backspace');

		await this.inputMessage.type(input.text, { delay: input.delay ?? 0 });
	}
}
