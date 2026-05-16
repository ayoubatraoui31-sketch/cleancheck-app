import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from './prisma';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { organization: true },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect('/sign-in');
  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  return user;
}

export async function syncUserWithDatabase() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  )?.emailAddress;

  if (!primaryEmail) return null;

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email: primaryEmail,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      avatarUrl: clerkUser.imageUrl,
    },
    create: {
      clerkId: clerkUser.id,
      email: primaryEmail,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      avatarUrl: clerkUser.imageUrl,
      orgId: '', // Sera assigné lors de l'onboarding
      role: 'OPERATOR',
    },
  });

  return user;
}

export async function getOrgUsers(orgId: string) {
  return prisma.user.findMany({
    where: { orgId, isActive: true },
    select: { id: true, firstName: true, lastName: true, email: true, role: true, avatarUrl: true },
    orderBy: { lastName: 'asc' },
  });
}
