export interface QueryFilter {
  field: string;
  operator: '==' | '!=' | '<' | '<=' | '>' | '>=' | 'array-contains' | 'in';
  value: unknown;
}

export interface IDataService {
  getDocument<T>(path: string): import('rxjs').Observable<T | null>;
  getCollection<T>(path: string, filters?: QueryFilter[]): import('rxjs').Observable<T[]>;
  setDocument<T>(path: string, data: T): Promise<void>;
  updateDocument<T>(path: string, data: Partial<T>): Promise<void>;
  deleteDocument(path: string): Promise<void>;
  addDocument<T>(collectionPath: string, data: T): Promise<string>;
}
