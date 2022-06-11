import { App, PluginSettingTab, Setting } from "obsidian";
import MyPlugin from "src/main";

export class SettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl("h2", { text: "Obsidian Ghost Publish" });

		const document = containerEl.createEl("p", {
			text: `Need help? Take a look on how to use me on `,
		});

		document.createEl("a", {
			attr: {
				href: "https://github.com/jaynguyens/obsidian-ghost-publish/blob/master/README.md",
			},
			text: "the documentation",
		});

		const donation = containerEl.createEl("p", {
			text: "You can support future development by ",
		});

		donation.createEl("a", {
			attr: {
				href: "https://www.buymeacoffee.com/jaynguyens",
			},
			text: "buy me a coffe ☕️",
		});

		containerEl.createEl("br");

		new Setting(containerEl)
			.setName("API URL")
			.setDesc("Your domain name e.g: https://domain.com")
			.addText((text) =>
				text
					.setPlaceholder("nguyens.co")
					.setValue(this.plugin.settings.url)
					.onChange(async (value) => {
						console.log("Blog URL: " + value);
						this.plugin.settings.url = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Admin API Key")
			.setDesc("Your custom integration Admin API Key")
			.addText((text) =>
				text
					.setPlaceholder("6251555c94ca6")
					.setValue(this.plugin.settings.adminToken)
					.onChange(async (value) => {
						console.log("admin api key: " + value);
						this.plugin.settings.adminToken = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
