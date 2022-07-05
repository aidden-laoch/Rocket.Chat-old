import { Page, Locator } from '@playwright/test';

export class HomeContent {
	private readonly page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	get lastUserMessage(): Locator {
		return this.page.locator('[data-qa-id=UserMessage]').last();
	}

	get lastUserMessageNotSequential(): Locator {
		return this.page.locator('[data-qa-id=UserMessage]:not(.sequential)').last();
	}

	getUserMessage(name: string): Locator {
		return this.page.locator(`[data-username="${name}"][data-qa-type="username"]`).last();
	}

	getUserFigure(name: string): Locator {
		return this.page.locator(`figure[data-username="${name}"]`).last();
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

	get btnFullProfile(): Locator {
		return this.page.locator('[data-qa="UserCard"] a');
	}

	getSystemMessage(text: string): Locator {
		return this.page.locator(`[data-qa-type="system-message-body"] >> text="${text}"`).last();
	}

	async doSendMessage(text: string): Promise<void> {
		await this.inputMessage.type(text);
		await this.page.keyboard.press('Enter');
	}
}
