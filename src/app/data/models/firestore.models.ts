import { Timestamp } from 'firebase/firestore';

// ─── User (collection: users/{uid}) ────────────────────────────────────────
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: 'free' | 'pro';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── Property (collection: users/{uid}/properties/{id}) ────────────────────
export type PropertyType = 'apartment' | 'house' | 'commercial' | 'land';

export interface Property {
  id: string;
  ownerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: PropertyType;
  area?: number;
  purchaseDate?: Timestamp;
  purchaseValue?: number;
  imageURL?: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ─── MaintenanceLog (collection: …/properties/{id}/maintenanceLogs/{id}) ───
export type MaintenanceCategory =
  | 'electrical' | 'hydraulic' | 'structural' | 'painting'
  | 'cleaning' | 'pest_control' | 'appliances' | 'other';

export type MaintenanceStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface MaintenanceLog {
  id: string;
  propertyId: string;
  ownerId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  status: MaintenanceStatus;
  priority: 'low' | 'medium' | 'high' | 'critical';
  scheduledDate?: Timestamp;
  completedDate?: Timestamp;
  cost?: number;
  contractor?: string;
  attachments?: Attachment[];
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Attachment {
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Timestamp;
}
