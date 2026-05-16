import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ConstatType, TemplateCategory, SiteType, Severity, Status } from '@prisma/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'à l'instant';
  if (diffMins < 60) return `il y a ${diffMins} min`;
  if (diffHours < 24) return `il y a ${diffHours}h`;
  if (diffDays < 7) return `il y a ${diffDays}j`;
  return formatDate(date);
}

export function getCountdown(deadline: Date | string): { text: string; isUrgent: boolean; isExpired: boolean } {
  const now = new Date().getTime();
  const end = new Date(deadline).getTime();
  const diff = end - now;

  if (diff <= 0) return { text: 'EXPIRÉ', isUrgent: true, isExpired: true };

  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  return {
    text: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
    isUrgent: hours < 2,
    isExpired: false,
  };
}

export function getStatusLabel(status: Status): string {
  const labels: Record<string, string> = {
    pending: 'En attente',
    responded: 'À valider',
    validated: 'Validé',
    rejected: 'Rejeté',
    expired: 'Expiré',
    cancelled: 'Annulé',
  };
  return labels[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    responded: 'bg-blue-100 text-blue-800 border-blue-200',
    validated: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    rejected: 'bg-red-100 text-red-800 border-red-200',
    expired: 'bg-gray-100 text-gray-600 border-gray-200',
    cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getSeverityColor(severity: Severity): string {
  const colors: Record<string, string> = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };
  return colors[severity] || 'bg-gray-100 text-gray-800';
}

export function getSeverityLabel(severity: Severity): string {
  const labels: Record<string, string> = {
    low: 'Faible',
    medium: 'Moyenne',
    high: 'Élevée',
    critical: 'Critique',
  };
  return labels[severity] || severity;
}

export function getConstatTypeLabel(type: ConstatType): string {
  const labels: Record<string, string> = {
    DEPOUSSIERAGE: 'Dépoussiérage',
    LAVAGE_SOLS: 'Lavage des sols',
    NETTOYAGE_VITRES: 'Nettoyage des vitres',
    NETTOYAGE_SANITAIRES: 'Nettoyage des sanitaires',
    DESINFECTION_SURFACES: 'Désinfection des surfaces',
    DECAPAGE_CRISTALLISATION: 'Décapage / Cristallisation',
    NETTOYAGE_DAB_GAB: 'Nettoyage DAB / GAB',
    AUTRE: 'Autre',
  };
  return labels[type] || type;
}

export function getConstatTypeDeadline(type: ConstatType): number {
  const deadlines: Record<string, number> = {
    DEPOUSSIERAGE: 24,
    LAVAGE_SOLS: 24,
    NETTOYAGE_VITRES: 72,
    NETTOYAGE_SANITAIRES: 4,
    DESINFECTION_SURFACES: 24,
    DECAPAGE_CRISTALLISATION: 240,
    NETTOYAGE_DAB_GAB: 24,
    AUTRE: 24,
  };
  return deadlines[type] || 24;
}

export function getConstatTypeSeverity(type: ConstatType): Severity {
  const severities: Record<string, Severity> = {
    DEPOUSSIERAGE: Severity.MEDIUM,
    LAVAGE_SOLS: Severity.MEDIUM,
    NETTOYAGE_VITRES: Severity.LOW,
    NETTOYAGE_SANITAIRES: Severity.CRITICAL,
    DESINFECTION_SURFACES: Severity.HIGH,
    DECAPAGE_CRISTALLISATION: Severity.LOW,
    NETTOYAGE_DAB_GAB: Severity.HIGH,
    AUTRE: Severity.MEDIUM,
  };
  return severities[type] || Severity.MEDIUM;
}

export function getTemplateCategoryLabel(category: TemplateCategory): string {
  const labels: Record<string, string> = {
    DEPOUSSIERAGE: 'Dépoussiérage',
    LAVAGE_SOLS: 'Lavage des sols',
    NETTOYAGE_VITRES: 'Nettoyage des vitres',
    NETTOYAGE_SANITAIRES: 'Nettoyage des sanitaires',
    DESINFECTION_SURFACES: 'Désinfection des surfaces',
    DECAPAGE_CRISTALLISATION: 'Décapage / Cristallisation',
    NETTOYAGE_DAB_GAB: 'Nettoyage DAB / GAB',
    GENERAL: 'Général',
  };
  return labels[category] || category;
}

export function getSiteTypeLabel(type: SiteType): string {
  const labels: Record<string, string> = {
    AGENCE_BANCAIRE: 'Agence bancaire',
    BUREAU: 'Bureau',
    COMMERCE: 'Commerce',
    ENTREPOT: 'Entrepôt',
    INDUSTRIE: 'Industrie',
    AUTRE: 'Autre',
  };
  return labels[type] || type;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function generateId(): string {
  return `cc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function isWithinGeofence(
  userLat: number, userLng: number,
  siteLat: number, siteLng: number,
  radiusMeters: number
): boolean {
  const R = 6371000;
  const dLat = ((siteLat - userLat) * Math.PI) / 180;
  const dLng = ((siteLng - userLng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((userLat * Math.PI) / 180) *
    Math.cos((siteLat * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c) <= radiusMeters;
}
