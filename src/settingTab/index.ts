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
				href: "https://github.com/Southpaw1496/obsidian-send-to-ghost#usage",
			},
			text: "the documentation",
		});

		new Setting(containerEl)
			.setName("Site URL")
			.setDesc(
				"The URL of your Ghost site. Make sure to include https:// at the beginning"
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
			.setName("Access Token")
			.setDesc("Your Staff Access Token or Admin API Key")
			.addText((text) =>
				text
					.setPlaceholder("6251555c94ca6")
					.setValue(this.plugin.settings.adminToken)
					.onChange(async (value) => {
						this.plugin.settings.adminToken = value;
						await this.plugin.saveSettings();
					})
			);
			new Setting(containerEl)
				.setName("Debug Mode")
				.setDesc("Print additional information to the console about the requests the plugin sends and receives. Useful for finding the cause of bugs.")
				.addToggle((toggle) => {
					toggle
						.setValue(this.plugin.settings.debug)
						.onChange(async (value) => {
							this.plugin.settings.debug = value
							await this.plugin.saveSettings()
						})
				})

	}
}
