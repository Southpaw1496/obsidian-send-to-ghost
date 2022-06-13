# Obsidian Ghost Publish

Plugin for publish to [Ghost](https://ghost.org/) site for [Obsidian](https://obsidian.md/) with a single click.

## How to use

- Create a custom integration follow this [link](https://ghost.org/integrations/custom-integrations/). You would need an **Admin API Key** and **API URL**.
- Once you install the plugin, enable the plugin and add the API KEy and API URL to the setting.
- That's it! you now are able to publish the current document by click on the ghost icon on the sidebar or use the command pallete (CMD+P).

## Frontmatter format

Obsidian Ghost Publish use frontmatter to specify on how you want to publish your post.

At the moment, the format is limited to:

```md
title: string (default: file name)
tags: (default: [])
- tag1
- tag2
featured: boolean (default: false)
published: boolean (default: false)
excerpt: string (default: undefined)
feature_image: string (default: undefined)
```

Note:

- `published` will allows you to specify if you want to publish a post now or draft a post.

### How to run on dev

- Clone this repo.
- `npm i` or `yarn` to install dependencies
- `npm run dev` to start compilation in watch mode.

### Manually installing the plugin

- Run `npm run build`
- Copy over `main.js` and `manifest.json` to your vault `VaultFolder/.obsidian/plugins/your-plugin-id/`.

### Issues & Requests

- For feature requests, please take use of Discussions.
- For any issues with current versions, please use Issues.
