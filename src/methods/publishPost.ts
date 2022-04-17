import { SettingsProp, ViewProp, ContentProp } from "./../types/index";
import { Notice, request } from "obsidian";

import { sign } from "jsonwebtoken";

const matter = require("gray-matter");
const MarkdownIt = require("markdown-it");

const md = new MarkdownIt();

export const publishPost = async (view: ViewProp, settings: SettingsProp) => {
	const version = "v4";

	// Admin API key goes here
	const key = settings.adminToken;

	// Split the key into ID and SECRET
	const [id, secret] = key.split(":");

	// Create the token (including decoding secret)
	const token = sign({}, Buffer.from(secret, "hex"), {
		keyid: id,
		algorithm: "HS256",
		expiresIn: "5m",
		audience: `/${version}/admin/`,
	});

	// get frontmatter
	const m = matter(`${view.data}`);

	const frontmatter = {
		title: m.data.title || view.file.basename,
		tags: m.data.tags || undefined,
		featured: m.data.featured || false,
		status: m.data.status || "draft",
		excerpt: m.data.excerpt || undefined,
		feature_image: m.data.feature_image || undefined,
	};

	const contentPost = (frontmatter: ContentProp) => ({
		posts: [
			{
				...frontmatter,
				html: md.render(m.content),
			},
		],
	});

	const body = contentPost(frontmatter);

	const result = await request({
		url: `${settings.url}/ghost/api/${version}/admin/posts/?source=html`,
		method: "POST",
		contentType: "application/json",
		headers: {
			"Access-Control-Allow-Origin": "app://obsidian.md",
			"Access-Control-Allow-Methods": "POST",
			"Content-Type": "application/json;charset=utf-8",
			Authorization: `Ghost ${token}`,
		},
		body: JSON.stringify(body),
	});

	const json = JSON.parse(result);

	if (json?.posts) {
		new Notice(
			`"${json?.posts?.[0]?.title}" has been ${json?.posts?.[0]?.status} successful!`
		);
	} else {
		new Notice(`${json.errors[0].context || json.errors[0].message}`);
		new Notice(
			`${json.errors[0]?.details[0].message} - ${json.errors[0]?.details[0].params.allowedValues}`
		);
	}

	return json;
};
