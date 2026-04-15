export interface UploadResult {
  downloadURL: string;
  fullPath: string;
  name: string;
  size: number;
  contentType: string;
}

export interface IStorageService {
  uploadFile(path: string, file: File): Promise<UploadResult>;
  deleteFile(path: string): Promise<void>;
  getDownloadURL(path: string): Promise<string>;
}
