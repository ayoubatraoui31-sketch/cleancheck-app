'use server';

import { prisma } from '@/lib/prisma';

export async function getOrgSites(orgId: string) {
  return prisma.site.findMany({
    where: { orgId, isActive: true },
    select: { id: true, name: true, address: true, latitude: true, longitude: true },
    orderBy: { name: 'asc' },
  });
}
