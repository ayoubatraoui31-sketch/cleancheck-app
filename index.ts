import { Status, Severity, UserRole, ConstatType, TemplateCategory, SiteType } from '@prisma/client';

export interface ConstatWithRelations {
  id: string;
  title: string;
  description: string;
  constatType: ConstatType;
  severity: Severity;
  beforeImage: string;
  beforeThumbnail: string | null;
  afterImage: string | null;
  afterThumbnail: string | null;
  status: Status;
  deadline: Date;
  duration: number;
  locationName: string | null;
  latitude: number | null;
  longitude: number | null;
  responseComment: string | null;
  rejectionReason: string | null;
  respondedAt: Date | null;
  validatedAt: Date | null;
  createdAt: Date;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
  };
  site: {
    id: string;
    name: string;
    address: string;
    siteType: SiteType;
  } | null;
}

export interface CreateConstatInput {
  title: string;
  description: string;
  constatType: ConstatType;
  severity: Severity;
  beforeImage: string;
  recipientId: string;
  siteId?: string;
  duration: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}

export interface RespondToConstatInput {
  constatId: string;
  afterImage: string;
  comment?: string;
}

export interface ValidateConstatInput {
  constatId: string;
  approved: boolean;
  rejectionReason?: string;
}

export interface DashboardStats {
  totalConstats: number;
  pendingCount: number;
  respondedCount: number;
  validatedCount: number;
  rejectedCount: number;
  expiredCount: number;
  avgResolutionTime: number;
  qualityScore: number;
  byType: Record<string, number>;
}

export interface SiteWithStats {
  id: string;
  name: string;
  address: string;
  siteType: SiteType;
  constatCount: number;
  lastInspectionDate: Date | null;
  qualityScore: number;
}

export interface InspectionTemplateWithItems {
  id: string;
  name: string;
  description: string | null;
  category: TemplateCategory;
  deadlineHours: number;
  severity: Severity;
  items: {
    id: string;
    label: string;
    description: string | null;
    maxScore: number;
    photoRequired: boolean;
    order: number;
  }[];
}

export interface OfflineConstat {
  id: string;
  title: string;
  description: string;
  constatType: ConstatType;
  severity: Severity;
  beforeImage: string;
  recipientId: string;
  siteId?: string;
  duration: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  status: 'pending_sync';
  createdAt: string;
  deadline: string;
}

export interface UserWithOrg {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl: string | null;
  orgId: string;
  organization: {
    id: string;
    name: string;
    plan: string;
  };
}

export type FilterStatus = 'all' | 'pending' | 'responded' | 'validated' | 'rejected' | 'expired';

export const CONSTAT_TYPE_LABELS: Record<ConstatType, string> = {
  DEPOUSSIERAGE: 'Dépoussiérage',
  LAVAGE_SOLS: 'Lavage des sols',
  NETTOYAGE_VITRES: 'Nettoyage des vitres',
  NETTOYAGE_SANITAIRES: 'Nettoyage des sanitaires',
  DESINFECTION_SURFACES: 'Désinfection des surfaces',
  DECAPAGE_CRISTALLISATION: 'Décapage / Cristallisation',
  NETTOYAGE_DAB_GAB: 'Nettoyage DAB / GAB',
  AUTRE: 'Autre',
};

export const CONSTAT_TYPE_DEADLINES: Record<ConstatType, number> = {
  DEPOUSSIERAGE: 24,
  LAVAGE_SOLS: 24,
  NETTOYAGE_VITRES: 72,
  NETTOYAGE_SANITAIRES: 4,
  DESINFECTION_SURFACES: 24,
  DECAPAGE_CRISTALLISATION: 240,
  NETTOYAGE_DAB_GAB: 24,
  AUTRE: 24,
};

export const CONSTAT_TYPE_SEVERITY: Record<ConstatType, Severity> = {
  DEPOUSSIERAGE: Severity.MEDIUM,
  LAVAGE_SOLS: Severity.MEDIUM,
  NETTOYAGE_VITRES: Severity.LOW,
  NETTOYAGE_SANITAIRES: Severity.CRITICAL,
  DESINFECTION_SURFACES: Severity.HIGH,
  DECAPAGE_CRISTALLISATION: Severity.LOW,
  NETTOYAGE_DAB_GAB: Severity.HIGH,
  AUTRE: Severity.MEDIUM,
};

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  DEPOUSSIERAGE: 'Dépoussiérage',
  LAVAGE_SOLS: 'Lavage des sols',
  NETTOYAGE_VITRES: 'Nettoyage des vitres',
  NETTOYAGE_SANITAIRES: 'Nettoyage des sanitaires',
  DESINFECTION_SURFACES: 'Désinfection des surfaces',
  DECAPAGE_CRISTALLISATION: 'Décapage / Cristallisation',
  NETTOYAGE_DAB_GAB: 'Nettoyage DAB / GAB',
  GENERAL: 'Général',
};
