export interface SettingsProp {
    url: string,
    adminToken: string,
    publishStatus: string
}

export const DEFAULT_SETTINGS: SettingsProp = {
    url: '',
    adminToken: '',
    publishStatus: 'draft'
}

