import { Page, Locator } from '@playwright/test';

import { HomeContent, HomeSidebar, HomeFlextab } from './fragments';

export class HomeChannel {
	private readonly page: Page;

	readonly content: HomeContent;

	readonly sidebar: HomeSidebar;

	readonly tabs: HomeFlextab;

	constructor(page: Page) {
		this.page = page;

		this.content = new HomeContent(page);
		this.sidebar = new HomeSidebar(page);
		this.tabs = new HomeFlextab(page);
	}

	get btnModalCancel(): Locator {
		return this.page.locator('#modal-root .rcx-button--danger.rcx-button');
	}

	get btnModalConfirm(): Locator {
		return this.page.locator('#modal-root .rcx-button--primary.rcx-button');
	}

	get inputFileDescription(): Locator {
		return this.page.locator('#modal-root [placeholder="Description"]');
	}

	get inputFileName(): Locator {
		return this.page.locator('#modal-root [value="any_file.txt"]');
	}
}
