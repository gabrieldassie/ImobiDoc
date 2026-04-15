import { Injectable, inject } from '@angular/core';
import {
  Storage,
  ref,
  uploadBytes,
  deleteObject,
  getDownloadURL,
  getMetadata,
} from '@angular/fire/storage';
import type { IStorageService, UploadResult } from '../../core/interfaces';

@Injectable({ providedIn: 'root' })
export class FirebaseStorageService implements IStorageService {
  private readonly storage = inject(Storage);

  async uploadFile(path: string, file: File): Promise<UploadResult> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const metadata = await getMetadata(snapshot.ref);
    return {
      downloadURL,
      fullPath: snapshot.ref.fullPath,
      name: snapshot.ref.name,
      size: metadata.size,
      contentType: metadata.contentType ?? file.type,
    };
  }

  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(this.storage, path);
    await deleteObject(storageRef);
  }

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    return getDownloadURL(storageRef);
  }
}
