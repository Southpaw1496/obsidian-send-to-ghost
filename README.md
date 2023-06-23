# Send to Ghost

A maintained fork of Jay Nguyen's [obsidian-ghost-publish](https://github.com/jaynguyens/obsidian-ghost-publish). It allows you to send Obsidian notes to the [Ghost](https://ghost.org) blogging platform, either as published or draft posts.

## Usage

-   In Ghost, create a new Custom Integration following [this guide](https://ghost.org/integrations/custom-integrations/). You will need the **Admin API Key** and the **API URL** later.
-   Install and enable the plugin
-   In the plugin settings, fill in the API URL and Admin API Key from the Custom Integration you created earlier.
-   You can now publish documents by clicking the little ghost in the sidebar, or by using the command pallete.

## Front Matter format

Send to Ghost uses front matter to set Ghost-specific settings such as the title, tags, and the featured image. You can add front matter by enclosing it in `---` at the beginning of a note.

The following options are supported:

```md
---
title: String (default: filename)
tags: (default: none)
- tag1
- tag2
featured: Boolean (default: false)
published: Boolean (default: false)
excerpt: String (default: blank)
feature_image: String (default: blank)
---
```

### Development

This plugin uses PNPM for dependency management.

-   Clone the repository.
-   Run `pnpm i` to install the necessary dependencies
-   Run `pnpm dev` to automaticlly recompile as the project files change.

### Manual installation

-   Run `pnpm build`
-   Copy `main.js` and `manifest.json` to `VaultFolder/.obsidian/plugins/send-to-ghost/` where `Vaultfolder` is the location of your Obsidian vault.

### Issues & Support

If you find a bug in the plugin, please submit an [issue](https://github.com/Southpaw1496/obsidian-send-to-ghost). Otherwise, please contact me via [my website](https://southpaw1496.me).
