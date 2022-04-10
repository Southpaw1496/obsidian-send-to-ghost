import { MarkdownView, Plugin } from 'obsidian';

import { DEFAULT_SETTINGS, SettingsProp } from './types/index';
import { SettingTab } from './settingTab'
import { publishPost } from './methods/publishPost';


export default class MyPlugin extends Plugin {
	settings: SettingsProp;

	async onload() {
		// load the settings first
		await this.loadSettings();

		// 2 ways to publish post:

		// 1. Click on the ghost icon on the left
		this.addRibbonIcon('ghost', 'Publish Ghost', () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);

			publishPost(view, this.settings)
		});

		// 2. Run the by command + P
		this.addCommand({
			id: 'publish',
			name: 'Publish current document',
			editorCallback: (_, view: MarkdownView) => {
				publishPost(view, this.settings)
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() { }
	async loadSettings() { this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData()) }
	async saveSettings() { await this.saveData(this.settings) }
}