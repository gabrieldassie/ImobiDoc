import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  docData,
  collectionData,
  WhereFilterOp,
} from '@angular/fire/firestore';
import type { IDataService, QueryFilter } from '../../core/interfaces';

@Injectable({ providedIn: 'root' })
export class FirebaseDataService implements IDataService {
  private readonly firestore = inject(Firestore);

  getDocument<T>(path: string): Observable<T | null> {
    const ref = doc(this.firestore, path);
    return docData(ref) as Observable<T | null>;
  }

  getCollection<T>(path: string, filters?: QueryFilter[]): Observable<T[]> {
    const ref = collection(this.firestore, path);
    if (filters && filters.length > 0) {
      const constraints = filters.map((f) =>
        where(f.field, f.operator as WhereFilterOp, f.value)
      );
      const q = query(ref, ...constraints);
      return collectionData(q, { idField: 'id' }) as Observable<T[]>;
    }
    return collectionData(ref, { idField: 'id' }) as Observable<T[]>;
  }

  async setDocument<T>(path: string, data: T): Promise<void> {
    const ref = doc(this.firestore, path);
    await setDoc(ref, data as object);
  }

  async updateDocument<T>(path: string, data: Partial<T>): Promise<void> {
    const ref = doc(this.firestore, path);
    await updateDoc(ref, data as object);
  }

  async deleteDocument(path: string): Promise<void> {
    const ref = doc(this.firestore, path);
    await deleteDoc(ref);
  }

  async addDocument<T>(collectionPath: string, data: T): Promise<string> {
    const ref = collection(this.firestore, collectionPath);
    const docRef = await addDoc(ref, data as object);
    return docRef.id;
  }
}
