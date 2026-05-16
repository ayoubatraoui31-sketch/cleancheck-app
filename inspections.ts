'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';
import { Severity, Status } from '@prisma/client';
import type { InspectionTemplateWithItems } from '@/types';

export async function getInspectionTemplates(): Promise<InspectionTemplateWithItems[]> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  return prisma.inspectionTemplate.findMany({
    where: { orgId: user.orgId, isDefault: true },
    include: {
      items: { orderBy: { order: 'asc' } },
    },
    orderBy: { name: 'asc' },
  }) as Promise<InspectionTemplateWithItems[]>;
}

export async function getInspectionTemplateById(id: string): Promise<InspectionTemplateWithItems | null> {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  return prisma.inspectionTemplate.findFirst({
    where: { id, orgId: user.orgId },
    include: {
      items: { orderBy: { order: 'asc' } },
    },
  }) as Promise<InspectionTemplateWithItems | null>;
}

export async function createInspection(data: {
  templateId: string;
  siteId: string;
  items: { templateItemId: string; score: number; comment?: string }[];
}) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  const template = await prisma.inspectionTemplate.findFirst({
    where: { id: data.templateId, orgId: user.orgId },
    include: { items: true },
  });

  if (!template) throw new Error('Template non trouvé');

  const maxScore = template.items.reduce((sum, item) => sum + item.maxScore, 0);
  const totalScore = data.items.reduce((sum, item) => sum + item.score, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);
  const isPass = percentage >= template.passThreshold;

  const inspection = await prisma.inspection.create({
    data: {
      templateId: data.templateId,
      siteId: data.siteId,
      inspectorId: user.id,
      totalScore,
      maxScore,
      isPass,
      completedAt: new Date(),
      items: {
        create: data.items.map((item) => ({
          templateItemId: item.templateItemId,
          score: item.score,
          comment: item.comment,
        })),
      },
    },
    include: {
      site: { select: { name: true } },
      template: { select: { name: true, category: true } },
    },
  });

  // Si score insuffisant, créer un constat automatique
  if (!isPass) {
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + template.deadlineHours);

    const constat = await prisma.constat.create({
      data: {
        title: `Non-conformité : ${template.name}`,
        description: `Inspection ${template.name} à ${inspection.site.name} : score ${percentage}% (seuil: ${template.passThreshold}%). Points à corriger : ${data.items.filter(i => i.score < 3).length}`,
        constatType: template.category as any,
        severity: template.severity,
        beforeImage: '', // Sera ajouté par l'inspecteur
        senderId: user.id,
        recipientId: user.id, // TODO: assigner au bon opérateur
        orgId: user.orgId,
        siteId: data.siteId,
        duration: template.deadlineHours,
        deadline,
        status: Status.PENDING,
      },
    });

    await createNotification({
      userId: user.id,
      type: 'NEW_CONSTAT',
      title: `Non-conformité détectée : ${template.name}`,
      message: `Score: ${percentage}% — Constat créé automatiquement`,
      data: { constatId: constat.id },
      sentVia: ['in_app'],
    });
  }

  revalidatePath('/inspections');
  revalidatePath('/dashboard');
  return inspection;
}

export async function getInspections(siteId?: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error('Non authentifié');

  return prisma.inspection.findMany({
    where: {
      site: { orgId: user.orgId },
      ...(siteId ? { siteId } : {}),
    },
    include: {
      site: { select: { name: true } },
      template: { select: { name: true, category: true } },
      inspector: { select: { firstName: true, lastName: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
}
