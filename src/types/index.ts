export interface SettingsProp {
	url: string;
	adminToken: string;
}

export const DEFAULT_SETTINGS: SettingsProp = {
	url: "",
	adminToken: "",
};

export interface ContentProp {
	title: string;
	tags?: string[];
	featured?: boolean;
	status: string;
	excerpt?: string | undefined;
	feature_image?: string;
}

export interface DataProp {
	content: string;
}
