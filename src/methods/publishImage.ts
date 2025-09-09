import { MarkdownView, Notice, RequestUrlParam, requestUrl, getBlobArrayBuffer, TFile} from 'obsidian';
import {SettingsProp} from './../types/index';

/**
 * 노트에서 로컬 이미지 링크를 찾아 Ghost에 업로드하고,
 * 업로드된 URL로 치환된 내용을 담은 새로운 임시 파일을 생성하여 그 파일의 TFile 객체를 반환합니다.
 * @param settings 플러그인 설정
 * @param view 현재 Markdown 뷰
 * @param token Ghost Admin API 토큰
 * @returns 내용이 수정된 임시 파일의 TFile 객체
 */
export async function findAndUploadImages(settings: SettingsProp, view: MarkdownView, token: string): Promise<TFile | undefined> {
    if (!settings.url || !settings.adminToken) {
        new Notice("Ghost URL or Admin API Key is not set. Please check your plugin settings.");
        return;
    }

    // 1. Get all the content of current editor in string.
    let noteContent = view.editor.getValue();
    noteContent = removeBlockquotePrefixes(noteContent);
    
    // 2. Find all the `![[...]]` form of local image link in note.
    const imageLinkRegex = /!\[\[([^\]]+\.(?:png|jpg|jpeg|gif|bmp|svg))\]\]/g;
    const matches = [...noteContent.matchAll(imageLinkRegex)];

    if (matches.length > 0) {
        // 3. Check the Frontmatter end to distinguish the image.
        let frontmatterEndIndex = -1;
        if (noteContent.startsWith('---')) {
            const secondDelimiterIndex = noteContent.indexOf('---', 3); 
            if (secondDelimiterIndex !== -1) {
                frontmatterEndIndex = secondDelimiterIndex;
            }
        }
        
        new Notice(`Upload ${matches.length} images to Ghost...`);

        // 4. repeat for all images in note.
        for (const match of matches) {
            const matchStartIndex = match.index as number;
            const localImageMarkdown = match[0]; // `![[image.png]]` 전체
            const imageName = match[1];          // `image.png` 부분

            const imageFile = this.app.metadataCache.getFirstLinkpathDest(imageName, view.file.path) as TFile;

            if (imageFile) {
                const uploadedUrl = await processImage(settings, imageFile, token);
                
                if (uploadedUrl) {
                    let replacementText = '';

                    if (frontmatterEndIndex !== -1 && matchStartIndex < frontmatterEndIndex) {
                        replacementText = uploadedUrl;
                    } else {
                        replacementText = `![](${uploadedUrl})`;
                    }
                    
                    noteContent = noteContent.replace(localImageMarkdown, replacementText);
                }
            }
        }
    } else {
        new Notice("Cannot find images from notes.");
    }

    // 7. 최종적으로 가공된 내용으로 임시 파일을 생성하거나 업데이트합니다.
    const tempFilePath = 'ghost-upload-preview.md';
    let tempFile = this.app.vault.getAbstractFileByPath(tempFilePath);

    if (tempFile instanceof TFile) {
        // 임시 파일이 이미 존재하면 내용을 덮어씁니다.
        await this.app.vault.modify(tempFile, noteContent);
    } else {
        // 임시 파일이 없으면 새로 생성합니다.
        tempFile = await this.app.vault.create(tempFilePath, noteContent);
    }

    // 8. 생성되거나 수정된 임시 파일의 TFile 객체를 반환합니다.
    return tempFile as TFile;
}

function removeBlockquotePrefixes(noteContent:string) {
  // 정규식을 사용하여 각 줄의 시작 부분에 있는 모든 인용구 패턴을 찾습니다.
  // 패턴 설명:
  // ^      : 각 줄의 시작 (m 플래그 때문에 가능)
  // ([ \t]*>)+ : '0개 이상의 공백/탭 + > 문자' 그룹이 1번 이상 반복되는 패턴
  //              (예: '>', '> >', '  > >' 등 모든 중첩 인용구 처리)
  // [ \t]?  : 마지막 > 문자 뒤에 올 수 있는 선택적인 공백/탭 1개
  // g (Global) : 문자열 전체에서 모든 일치 항목을 찾음
  // m (Multiline): ^가 문자열 전체의 시작이 아닌, 각 줄(line)의 시작에 대응하도록 함
  const blockquoteRegex = /^([ \t]*>)+[ \t]?/gm;

  // 찾은 모든 인용구 패턴을 빈 문자열('')로 치환합니다.
  return noteContent.replace(blockquoteRegex, '');
}
/**
 * 개별 이미지 파일을 받아 Ghost 블로그로 업로드하는 함수
 * @param imageFile 업로드할 이미지의 TFile 객체
 * @returns 성공 시 업로드된 이미지의 URL, 실패 시 null
 */
async function processImage(settings: SettingsProp, imageFile: TFile, token:string): Promise<string | null> {
    try {
        new Notice(`'${imageFile.name}' Uploading...`);

        // 1.  JWT generation for Ghost authentication
        const apiUrl = `${settings.url}/ghost/api/admin/images/upload/`;

        // 2. read image data as ArrayBuffer
        const imageData: ArrayBuffer = await this.app.vault.readBinary(imageFile);
        const formData = new FormData();
        const imageBlob = new Blob([imageData], { type: `image/${imageFile.extension}` });

        formData.append('file', imageBlob, imageFile.name);
        formData.append('ref', imageFile.path);

        const response = await fetch(apiUrl, {
                    mode: "cors",
					method: "POST",
					headers: {
						Authorization: `Ghost ${token}`,
					},
					body: formData
				})
        const data = await response.json();
        const uploadedUrl = data.images[0].url
        console.log(`✅ '${imageFile.name}' Upload successful! URL: ${uploadedUrl}`);
        new Notice(`✅ '${imageFile.name}' Upload successful!. URL: ${uploadedUrl}`);
        return uploadedUrl
        
    } catch (error) {
        console.error(`Ghost upload failed! (${imageFile.name}):`, error);
        new Notice(`❌ '${imageFile.name}' Upload failed! Check developer consoles.`, 5000);
        return null;
    }
}
