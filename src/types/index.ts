export interface SettingsProp {
	url: string;
	adminToken: string;
}

export const DEFAULT_SETTINGS: SettingsProp = {
	url: "",
	adminToken: "",
};

export interface ViewProp {
	file: {
		basename: string;
	};
	data: string;
}

export interface ContentProp {
	title: string;
	tags: string[];
	featured: boolean;
	status: "published" | "draft";
	excerpt: string;
	feature_image: string;
}
