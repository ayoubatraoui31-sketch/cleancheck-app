'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function createNotification({
  userId,
  type,
  title,
  message,
  data,
  sentVia = ['in_app'],
}: {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  sentVia?: string[];
}) {
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      data: data || {},
      sentVia,
    },
  });

  // TODO: Envoyer push FCM si l'utilisateur a un token
  // TODO: Envoyer email via Resend si configuré

  revalidatePath('/notifications');
  return notification;
}

export async function markNotificationAsRead(notificationId: string) {
  await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
  revalidatePath('/notifications');
}

export async function getUnreadCount(userId: string): Promise<number> {
  return prisma.notification.count({
    where: { userId, isRead: false },
  });
}
