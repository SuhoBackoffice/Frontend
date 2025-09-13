//요청
export enum FileUploadType {
  BRANCH_IMAGE = 'BRANCH_IMAGE',
  STRAIGHT_IMAGE = 'STRAIGHT_IMAGE',
}

export interface PostFileUploadRequest {
  file: File;
  type: FileUploadType;
}

// 응답
export interface PostFileUploadResponse {
  fileName: string;
  fileUrl: string;
}
