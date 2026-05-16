'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { uploadImage } from '@/lib/cloudinary';
import type { CreateConstatInput, RespondToConstatInput, ValidateConstatInput } from '@/types';
import { Status } from '@prisma/client';

export async function getConstats(
  type: 'sent' | 'received',
  status?: string,
  page: number = 1,
  limit: number = 20
) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const where: Record<string, unknown> = {
    orgId: user.orgId,
    ...(type === 'sent' ? { senderId: user.id } : { recipientId: user.id }),
    ...(status && status !== 'all' && status !== 'expired' ? { status: status as Status } : {}),
  };

  // Gestion spéciale pour "expired"
  if (status === 'expired') {
    where.status = Status.PENDING;
    where.deadline = { lt: new Date() };
  }

  const [constats, total] = await Promise.all([
    prisma.constat.findMany({
      where,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        recipient: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
        site: { select: { id: true, name: true, address: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.constat.count({ where }),
  ]);

  return { constats, total, pages: Math.ceil(total / limit) };
}

export async function getConstatById(id: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const constat = await prisma.constat.findFirst({
    where: {
      id,
      orgId: user.orgId,
      OR: [{ senderId: user.id }, { recipientId: user.id }],
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      recipient: { select: { id: true, firstName: true, lastName: true, email: true, avatarUrl: true } },
      site: { select: { id: true, name: true, address: true, latitude: true, longitude: true } },
      signatures: {
        include: { user: { select: { firstName: true, lastName: true, avatarUrl: true } } },
      },
      logs: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
    },
  });

  if (!constat) throw new Error('Constat non trouvé');
  return constat;
}

export async function createConstat(data: CreateConstatInput & { beforeImageBase64?: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  // Upload image
  const uploadResult = await uploadImage(
    data.beforeImageBase64,
    'constats/before',
    { watermark: true }
  );

  const deadline = new Date();
  deadline.setHours(deadline.getHours() + data.duration);

  const constat = await prisma.constat.create({
    data: {
      title: data.title,
      description: data.description,
      severity: data.severity,
      beforeImage: uploadResult.secure_url,
      beforeThumbnail: uploadResult.thumbnail_url,
      recipientId: data.recipientId,
      senderId: user.id,
      orgId: user.orgId,
      siteId: data.siteId || null,
      duration: data.duration,
      deadline,
      latitude: data.latitude || null,
      longitude: data.longitude || null,
      locationName: data.locationName || null,
      status: Status.PENDING,
    },
    include: {
      sender: { select: { firstName: true, lastName: true } },
      recipient: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: 'CREATED',
      entityType: 'CONSTA',
      entityId: constat.id,
      performedById: user.id,
      performedByName: `${user.firstName} ${user.lastName}`,
      performedByRole: user.role,
      metadata: {
        lat: data.latitude,
        lng: data.longitude,
        deviceId: data.deviceId,
      },
      orgId: user.orgId,
    },
  });

  // Notification au destinataire
  await createNotification({
    userId: data.recipientId,
    type: 'NEW_CONSTAT',
    title: 'Nouveau constat de propreté',
    message: `${constat.sender.firstName} ${constat.sender.lastName} vous a assigné un constat : ${data.title}`,
    data: { constatId: constat.id },
    sentVia: ['in_app', 'email'],
  });

  revalidatePath('/constats');
  revalidatePath('/dashboard');
  return constat;
}

export async function respondToConstat(data: RespondToConstatInput & { afterImageBase64: string }) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const existing = await prisma.constat.findFirst({
    where: { id: data.constatId, recipientId: user.id, status: Status.PENDING },
    include: { sender: { select: { id: true, firstName: true, lastName: true, email: true } } },
  });

  if (!existing) throw new Error('Constat non trouvé ou déjà traité');

  // Upload image après nettoyage
  const uploadResult = await uploadImage(
    data.afterImageBase64,
    'constats/after',
    { watermark: true }
  );

  const constat = await prisma.constat.update({
    where: { id: data.constatId },
    data: {
      afterImage: uploadResult.secure_url,
      afterThumbnail: uploadResult.thumbnail_url,
      responseComment: data.comment || 'Nettoyage effectué',
      respondedAt: new Date(),
      status: Status.RESPONDED,
    },
    include: {
      sender: { select: { id: true, firstName: true, lastName: true, email: true } },
      recipient: { select: { firstName: true, lastName: true } },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: 'RESPONDED',
      entityType: 'CONSTA',
      entityId: constat.id,
      performedById: user.id,
      performedByName: `${user.firstName} ${user.lastName}`,
      performedByRole: user.role,
      orgId: user.orgId,
    },
  });

  // Notification à l'émetteur
  await createNotification({
    userId: constat.sender.id,
    type: 'CONSTAT_RESPONDED',
    title: 'Constat traité',
    message: `${constat.recipient.firstName} ${constat.recipient.lastName} a répondu à votre constat : ${constat.title}`,
    data: { constatId: constat.id },
    sentVia: ['in_app', 'email'],
  });

  revalidatePath('/constats');
  revalidatePath('/dashboard');
  return constat;
}

export async function validateConstat(data: ValidateConstatInput) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const existing = await prisma.constat.findFirst({
    where: {
      id: data.constatId,
      senderId: user.id,
      status: Status.RESPONDED,
    },
    include: {
      recipient: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  if (!existing) throw new Error('Constat non trouvé ou non répondu');

  const newStatus = data.approved ? Status.VALIDATED : Status.REJECTED;

  const constat = await prisma.constat.update({
    where: { id: data.constatId },
    data: {
      status: newStatus,
      validatedAt: new Date(),
      validatedById: user.id,
      ...(data.rejectionReason && { rejectionReason: data.rejectionReason }),
    },
    include: {
      sender: { select: { firstName: true, lastName: true } },
      recipient: { select: { id: true, firstName: true, lastName: true, email: true } },
    },
  });

  // Audit log
  await prisma.auditLog.create({
    data: {
      action: data.approved ? 'VALIDATED' : 'REJECTED',
      entityType: 'CONSTA',
      entityId: constat.id,
      performedById: user.id,
      performedByName: `${user.firstName} ${user.lastName}`,
      performedByRole: user.role,
      metadata: data.rejectionReason ? { reason: data.rejectionReason } : undefined,
      orgId: user.orgId,
    },
  });

  // Notification au destinataire
  await createNotification({
    userId: constat.recipient.id,
    type: data.approved ? 'CONSTAT_VALIDATED' : 'CONSTAT_REJECTED',
    title: data.approved ? 'Constat validé ✅' : 'Constat rejeté ❌',
    message: data.approved
      ? `${constat.sender.firstName} ${constat.sender.lastName} a validé votre nettoyage`
      : `${constat.sender.firstName} ${constat.sender.lastName} a rejeté votre nettoyage${data.rejectionReason ? ` : ${data.rejectionReason}` : ''}`,
    data: { constatId: constat.id },
    sentVia: ['in_app', 'email'],
  });

  revalidatePath('/constats');
  revalidatePath('/dashboard');
  return constat;
}

export async function getDashboardStats() {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const now = new Date();

  const [
    totalConstats,
    pendingCount,
    respondedCount,
    validatedCount,
    rejectedCount,
    expiredCount,
    resolutionTimes,
  ] = await Promise.all([
    prisma.constat.count({ where: { orgId: user.orgId } }),
    prisma.constat.count({ where: { orgId: user.orgId, status: Status.PENDING, deadline: { gte: now } } }),
    prisma.constat.count({ where: { orgId: user.orgId, status: Status.RESPONDED } }),
    prisma.constat.count({ where: { orgId: user.orgId, status: Status.VALIDATED } }),
    prisma.constat.count({ where: { orgId: user.orgId, status: Status.REJECTED } }),
    prisma.constat.count({ where: { orgId: user.orgId, status: Status.PENDING, deadline: { lt: now } } }),
    prisma.constat.findMany({
      where: { orgId: user.orgId, status: Status.VALIDATED, respondedAt: { not: null } },
      select: { createdAt: true, respondedAt: true },
    }),
  ]);

  const avgResolutionTime =
    resolutionTimes.length > 0
      ? resolutionTimes.reduce((acc, c) => {
          const diff = (c.respondedAt!.getTime() - c.createdAt.getTime()) / 3600000;
          return acc + diff;
        }, 0) / resolutionTimes.length
      : 0;

  const qualityScore =
    totalConstats > 0
      ? Math.round(((validatedCount / (validatedCount + rejectedCount || 1)) * 100))
      : 100;

  return {
    totalConstats,
    pendingCount,
    respondedCount,
    validatedCount,
    rejectedCount,
    expiredCount,
    avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    qualityScore,
  };
}

export async function checkExpiredConstats() {
  const now = new Date();
  const expired = await prisma.constat.updateMany({
    where: {
      status: Status.PENDING,
      deadline: { lt: now },
    },
    data: { status: Status.EXPIRED },
  });

  if (expired.count > 0) {
    revalidatePath('/constats');
    revalidatePath('/dashboard');
  }

  return expired.count;
}
