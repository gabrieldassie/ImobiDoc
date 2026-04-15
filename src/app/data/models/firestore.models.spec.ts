import { describe, it, expect } from 'vitest';
import { Timestamp } from 'firebase/firestore';
import type {
  UserProfile,
  Property,
  PropertyType,
  MaintenanceLog,
  MaintenanceCategory,
  MaintenanceStatus,
} from './firestore.models';

const now = Timestamp.now();

describe('Firestore Data Models', () => {
  describe('UserProfile', () => {
    it('should have required fields', () => {
      const user: UserProfile = {
        uid: 'user-1',
        email: 'user@example.com',
        displayName: 'Test User',
        tier: 'free',
        createdAt: now,
        updatedAt: now,
      };
      expect(user.uid).toBeTruthy();
      expect(user.email).toContain('@');
      expect(user.tier).toBe('free');
    });

    it('should support pro tier', () => {
      const proUser: UserProfile = {
        uid: 'pro-1', email: 'pro@x.com', displayName: 'Pro',
        tier: 'pro', stripeCustomerId: 'cus_123', stripeSubscriptionId: 'sub_456',
        createdAt: now, updatedAt: now,
      };
      expect(proUser.tier).toBe('pro');
      expect(proUser.stripeCustomerId).toBe('cus_123');
    });
  });

  describe('Property', () => {
    it('should support all property types', () => {
      const types: PropertyType[] = ['apartment', 'house', 'commercial', 'land'];
      types.forEach((type) => {
        const prop: Property = {
          id: `id-${type}`, ownerId: 'u1', name: `Test ${type}`,
          address: 'Rua A', city: 'São Paulo', state: 'SP', zipCode: '01000-000',
          type, createdAt: now, updatedAt: now,
        };
        expect(prop.type).toBe(type);
      });
    });

    it('should have address fields', () => {
      const prop: Property = {
        id: 'p1', ownerId: 'u1', name: 'Apto', address: 'Av. Paulista, 1000',
        city: 'São Paulo', state: 'SP', zipCode: '01310-100',
        type: 'apartment', createdAt: now, updatedAt: now,
      };
      expect(prop.city).toBe('São Paulo');
      expect(prop.zipCode).toBeTruthy();
    });
  });

  describe('MaintenanceLog', () => {
    it('should support all maintenance categories', () => {
      const categories: MaintenanceCategory[] = [
        'electrical', 'hydraulic', 'structural', 'painting',
        'cleaning', 'pest_control', 'appliances', 'other',
      ];
      expect(categories).toHaveLength(8);
    });

    it('should support all maintenance statuses', () => {
      const statuses: MaintenanceStatus[] = ['pending', 'in_progress', 'completed', 'cancelled'];
      expect(statuses).toHaveLength(4);
    });

    it('should support all priority levels', () => {
      const priorities: MaintenanceLog['priority'][] = ['low', 'medium', 'high', 'critical'];
      expect(priorities).toHaveLength(4);
    });

    it('should have required fields', () => {
      const log: MaintenanceLog = {
        id: 'log-1', propertyId: 'prop-1', ownerId: 'user-1',
        title: 'Fix leaking pipe', description: 'Bathroom pipe is leaking',
        category: 'hydraulic', status: 'pending', priority: 'high',
        createdAt: now, updatedAt: now,
      };
      expect(log.title).toBeTruthy();
      expect(log.category).toBe('hydraulic');
      expect(log.status).toBe('pending');
      expect(log.priority).toBe('high');
    });
  });
});
