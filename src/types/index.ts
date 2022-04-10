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


export interface ViewProp {
    file: {
        basename: string
    },
    data: string
}

export interface ContentProp {
    title: string,
    data: string
}
