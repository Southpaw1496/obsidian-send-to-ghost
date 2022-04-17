# Obsidian & Ghost

A simple plugin for Obsidian to publish to Ghost site with a single click.

## How to use

- Create a custom integration follow this [link](https://ghost.org/integrations/custom-integrations/). You would need an **Admin API Key** and **API URL**.
- Once you install the plugin, you would find an option "Obsidian Ghost Publish" under "Plugin options" and copy-paste it in the textbox.
- That's it! you now are able to publish by click on the ghost icon on the left hand or use the command pallete.

### How to run on dev

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Copy over `main.js`, `styles.css`, `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

### Issues & Requests

- For feature requests, please take use of Discussions.
- For any issues with current versions, please use Issues.
