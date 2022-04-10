import { SettingsProp, ViewProp, ContentProp } from './../types/index';
import { Notice, request } from "obsidian";

import { sign } from 'jsonwebtoken';
const MarkdownIt = require("markdown-it")

const md = new MarkdownIt()

export const publishPost = async (view: ViewProp, settings: SettingsProp) => {

    const content = {
        title: view.file.basename,
        data: view.data
    }

    const version = 'v4'

    console.log('content', content)
    console.log('settings', settings)

    // Admin API key goes here
    const key = settings.adminToken;

    // Split the key into ID and SECRET
    const [id, secret] = key.split(':');

    // Create the token (including decoding secret)
    const token = sign({}, Buffer.from(secret, 'hex'), {
        keyid: id,
        algorithm: 'HS256',
        expiresIn: '5m',
        audience: `/${version}/admin/`
    });


    const contentPost = (content: ContentProp, settings: SettingsProp) => ({
        "posts": [{
            "title": content.title,
            "html": md.render(content.data),
            "status": settings.publishStatus
        }]
    })

    const body = contentPost(content, settings);


    const result = await request({
        url: `${settings.url}/ghost/api/${version}/admin/posts/?source=html`,
        method: "POST",
        contentType: "application/json",
        headers: {
            'Access-Control-Allow-Origin': 'app://obsidian.md',
            'Access-Control-Allow-Methods': 'POST',
            'Content-Type': 'application/json;charset=utf-8',
            'Authorization': `Ghost ${token}`
        },
        body: JSON.stringify(body)
    })

    const json = JSON.parse(result)

    if (json?.errors) {
        new Notice(`${json.errors[0].type}! ${json.errors[0].message}`)
    }

    if (json?.posts) {
        new Notice(`"${json?.posts?.[0]?.title}" has been ${json?.posts?.[0]?.status} successful!`)
    }

    return json
}