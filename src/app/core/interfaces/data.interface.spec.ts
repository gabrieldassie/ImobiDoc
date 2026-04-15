import { describe, it, expect } from 'vitest';
import type { IDataService, QueryFilter } from './data.interface';

describe('IDataService Interface Contract', () => {
  it('should allow constructing a QueryFilter', () => {
    const filter: QueryFilter = {
      field: 'ownerId',
      operator: '==',
      value: 'user-123',
    };
    expect(filter.field).toBe('ownerId');
    expect(filter.operator).toBe('==');
    expect(filter.value).toBe('user-123');
  });

  it('should support all operator types', () => {
    const operators: QueryFilter['operator'][] = ['==', '!=', '<', '<=', '>', '>=', 'array-contains', 'in'];
    expect(operators).toHaveLength(8);
  });

  it('IDataService should have all required method signatures', () => {
    const mockService: IDataService = {
      getDocument: () => ({} as ReturnType<IDataService['getDocument']>),
      getCollection: () => ({} as ReturnType<IDataService['getCollection']>),
      setDocument: async () => {},
      updateDocument: async () => {},
      deleteDocument: async () => {},
      addDocument: async () => 'new-doc-id',
    };
    expect(typeof mockService.getDocument).toBe('function');
    expect(typeof mockService.addDocument).toBe('function');
  });

  it('addDocument should return a string id', async () => {
    const mockService: IDataService = {
      getDocument: () => ({} as ReturnType<IDataService['getDocument']>),
      getCollection: () => ({} as ReturnType<IDataService['getCollection']>),
      setDocument: async () => {},
      updateDocument: async () => {},
      deleteDocument: async () => {},
      addDocument: async () => 'generated-id-abc',
    };
    const id = await mockService.addDocument('path', {});
    expect(id).toBe('generated-id-abc');
  });
});
