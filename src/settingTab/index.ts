import { App, PluginSettingTab, Setting } from "obsidian";
import GhostPublish from "src/main";

export class SettingTab extends PluginSettingTab {
	plugin: GhostPublish;

	constructor(app: App, plugin: GhostPublish) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		const document = containerEl.createEl("p", {
			text: `If you get stuck, please refer to `,
		});

		document.createEl("a", {
			attr: {
				href: "https://github.com/Southpaw1496/obsidian-send-to-ghost/blob/master/README.md",
			},
			text: "the documentation",
		});

		new Setting(containerEl)
			.setName("API URL")
			.setDesc(
				"Your Ghost integration's API URL. Make sure to include https:// at the beginning"
			)
			.addText((text) =>
				text
					.setPlaceholder("https://ghost.org")
					.setValue(this.plugin.settings.url)
					.onChange(async (value) => {
						this.plugin.settings.url = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Admin API Key")
			.setDesc("Your Ghost integration's Admin API Key")
			.addText((text) =>
				text
					.setPlaceholder("6251555c94ca6")
					.setValue(this.plugin.settings.adminToken)
					.onChange(async (value) => {
						this.plugin.settings.adminToken = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
