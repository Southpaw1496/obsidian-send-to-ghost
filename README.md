# Send to Ghost

A maintained fork of Jay Nguyen's [obsidian-ghost-publish](https://github.com/jaynguyens/obsidian-ghost-publish). It allows you to send Obsidian notes to the [Ghost](https://ghost.org) blogging software, either as published or draft posts.

## Usage

### Authentication
Send to Ghost can use either a **Staff Access Token** or an **[Admin API Key](https://ghost.org/integrations/custom-integrations/)**. Each staff member has their own Staff Access Token which gives Send to Ghost permission to do all the things that they can do, while an Admin API Key must be created manually and gives all permissions. Because Obsidian plugins [can't store sensitive information securely](https://forum.obsidian.md/t/a-place-for-plugins-sensitive-data/18308), you should use a Staff Access Token, since its access is more limited. You could also consider creating a seperate staff user with barebones permissions for uploading posts if you are concerned about the security of your site.

Note that the Staff Access Tokens of users who have Administrator or Owner permissions have the same access as Admin API Keys. They are still preferred, since their access to your site is tied to the access of the staff member who they belong to. They are also usable with Starter sites on Ghost Pro.

#### Finding your Access Token
To get your Staff Access Token, go to the admin dashboard and click the avatar in the bottom-right corner, then click "Your Profile". Scroll down to find the token, hover over it and click the "copy" button to copy it to the clipboard.

### Using the Plugin
After installing the plugin in Obsidian, go to its settings and fill in the fields. Put the URL of your Ghost site in the "Site URL" field (or the `ghost.io` URL if you're using Ghost Pro), and your Staff Access Token/Admin API Key in the "Access Token" field. You can now click the ghost icon in the ribbon menu on the left or use the "Send to Ghost" command in the command palette to send the currently open note to Ghost.

**If your note isn't being published correctly and you're using the Ghost Pro starter plan, please see [this comment](https://github.com/Southpaw1496/obsidian-send-to-ghost/issues/6#issuecomment-3079441691). If you're not using the Ghost Pro starter plan, please leave a comment on [Issue #6](https://github.com/Southpaw1496/obsidian-send-to-ghost/issues/6)**.

### Front Matter Format

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
status: published | draft
---
```
### Sending Images

Due to the limitation of Ghost, Ghost does not send Cross Origin Resource Sharing(CORS) when picture is uploaded in server by api(/ghost/api/admin/images/upload). Since the obsidian is based on electron(web browser), you need to configure the nginx settings of Ghost which manually sends CORS messages to obsidian. If you do not configure settings, obsidian will prohibit the image upload and you can only upload the text to Ghost.

### Configuing Nginx in Ghost

1. In the Ghost hosting server, go to /etc/nginx/sites-enabled folder and edit (your-domain).conf or (your-domain)-ssl.conf.
The configuration varies regarding usage of ssl. Mostly, if your blog starts with http, edit (your-domain).conf. If your blog starts with https, edit (your-domain)-ssl.conf.

2. add this code snippet on top of your configuration file
```
map $http_origin $allow_origin {
        default "";
        "app://obsidian.md" $http_origin;
}
```

3. add this code snippet above location ~ /.well-known { line

```
    location ~ ^/ghost/api/admin/images/upload {
        add_header 'Access-Control-Allow-Origin' $allow_origin;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' $http_access_control_request_headers;
        add_header 'Access-Control-Allow-Credentials' 'true';

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' $allow_origin;
            add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
            add_header 'Access-Control-Allow-Headers' $http_access_control_request_headers;
            add_header 'Access-Control-Allow-Credentials' 'true';
            add_header 'Access-Control-Max-Age' 86400;
            add_header 'Content-Length' 0;
            return 204;
        }
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header Host $http_host;
        proxy_pass http://127.0.0.1:2368;
    }
```

4. Restart the nginx

This will only allow sending images with obsidian and not with any other web browsers. Sending images directly with POST will also work.

> [!note]
> - If the markdown blockquotes (>) are uploaded in ghost by api, you cannot fully erase the blockquote in Ghost editor. 
> Therefore, in this code, all the blockquotes are removed before sending to the Ghost.  
> Manually add the blockquotes after you upload it to Ghost.
> - This plugin manually writes ghost-upload-preview.md file in the root of your vault.

## Development

This plugin uses PNPM for dependency management.

-   Clone the repository.
-   Run `pnpm i` to install the necessary dependencies
-   Run `pnpm dev` to automaticlly recompile as the project files change.

## Manual installation

-   Run `pnpm build`
-   Copy `main.js` and `manifest.json` to `VaultFolder/.obsidian/plugins/send-to-ghost/` where `Vaultfolder` is the location of your Obsidian vault.

## Issues & Support

If you find a bug, please submit an [issue](https://github.com/Southpaw1496/obsidian-send-to-ghost). Otherwise, please contact me via [my website](https://southpaw1496.me).
