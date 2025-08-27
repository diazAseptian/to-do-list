import { Task } from '../lib/supabase';
import { isAfter, isBefore, startOfDay, addDays } from 'date-fns';

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Browser tidak mendukung notifikasi');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const checkDeadlineReminders = (tasks: Task[]) => {
  const tomorrow = addDays(startOfDay(new Date()), 1);
  
  const upcomingTasks = tasks.filter(task => {
    if (!task.deadline || task.status === 'Selesai') return false;
    
    const taskDeadline = startOfDay(new Date(task.deadline));
    
    // Check if deadline is tomorrow (H-1)
    return taskDeadline.getTime() === tomorrow.getTime();
  });

  if (upcomingTasks.length > 0 && Notification.permission === 'granted') {
    upcomingTasks.forEach(task => {
      new Notification(`Reminder: ${task.judul}`, {
        body: `Deadline besok! Kategori: ${task.kategori}`,
        icon: '/vite.svg',
        tag: `task-${task.id}`,
      });
    });
  }

  return upcomingTasks;
};

export const scheduleNotificationCheck = (tasks: Task[]) => {
  // Check every hour
  const checkInterval = 60 * 60 * 1000; // 1 hour in milliseconds
  
  const intervalId = setInterval(() => {
    checkDeadlineReminders(tasks);
  }, checkInterval);

  // Initial check
  setTimeout(() => {
    checkDeadlineReminders(tasks);
  }, 1000);

  return intervalId;
};