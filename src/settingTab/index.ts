import { App, PluginSettingTab, Setting } from 'obsidian';
import MyPlugin from 'src/main';

export class SettingTab extends PluginSettingTab {
    plugin: MyPlugin;

    constructor(app: App, plugin: MyPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();
        containerEl.createEl('h2', { text: 'Obsidian Ghost Integration' });

        new Setting(containerEl)
            .setName('API URL')
            .addText(text => text
                .setPlaceholder('nguyens.co')
                .setValue(this.plugin.settings.url)
                .onChange(async (value) => {
                    console.log('Blog URL: ' + value);
                    this.plugin.settings.url = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Admin API Key')
            .addText(text => text
                .setPlaceholder('6251555c94ca6')
                .setValue(this.plugin.settings.adminToken)
                .onChange(async (value) => {
                    console.log('admin api key: ' + value);
                    this.plugin.settings.adminToken = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Post publish status')
            .addDropdown(dropdown => dropdown
                .addOption('draft', 'Draft')
                .addOption('published', 'Publish')
                .setValue(this.plugin.settings.publishStatus)
                .onChange(async (value) => {
                    this.plugin.settings.publishStatus = value;
                    await this.plugin.saveSettings();
                }))
    }
}
