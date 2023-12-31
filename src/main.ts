import { MarkdownFileInfo, MarkdownView, Notice, Plugin } from "obsidian";

import { DEFAULT_SETTINGS, SettingsProp } from "./types/index";
import { SettingTab } from "./settingTab";
import { publishPost } from "./methods/publishPost";
export default class GhostPublish extends Plugin {
	settings: SettingsProp;

	async onload() {
		// load the settings first
		await this.loadSettings();

		// 2 ways to publish:
		// 1. Click on the ghost icon on the left
		this.addRibbonIcon("ghost", "Publish Ghost", () => {
			const view = this.app.workspace.getActiveViewOfType(MarkdownView);
			if (!view) {
				new Notice(
					"You must open the note that you want to send to Ghost."
				);
				return;
			}

			publishPost(view, this.settings);
		});

		// 2. Run the by command + P
		this.addCommand({
			id: "publish",
			name: "Send to Ghost",
			editorCallback: (_, view: MarkdownView | MarkdownFileInfo) => {
				if (!(view instanceof MarkdownView)) {
					new Notice(
						"You must open the note that you want to send to Ghostt"
					);
					return;
				}
				publishPost(view, this.settings);
			},

			},
	);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SettingTab(this.app, this));
	}

	onunload() {}
	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}
	async saveSettings() {
		await this.saveData(this.settings);
	}
}
