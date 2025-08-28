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

export const checkDailyReminders = (tasks: Task[]) => {
  const now = new Date();
  const currentHour = now.getHours();
  
  // Only send notifications at 10 AM or 7 PM
  if (currentHour !== 10 && currentHour !== 19) {
    return [];
  }
  
  const pendingTasks = tasks.filter(task => {
    if (task.status === 'Selesai') return false;
    
    // Show all pending and in-progress tasks
    return task.status === 'Belum dikerjakan' || task.status === 'Sedang dikerjakan';
  });

  if (pendingTasks.length > 0 && Notification.permission === 'granted') {
    const timeOfDay = currentHour === 10 ? 'Pagi' : 'Malam';
    const message = currentHour === 10 
      ? 'Selamat pagi! Jangan lupa kerjakan tugas hari ini'
      : 'Selamat malam! Cek progress tugas hari ini';
    
    new Notification(`Reminder ${timeOfDay}`, {
      body: `${message}. Kamu punya ${pendingTasks.length} tugas yang belum selesai.`,
      icon: '/vite.svg',
      tag: `daily-reminder-${currentHour}`,
    });
  }

  return pendingTasks;
};

export const scheduleNotificationCheck = (tasks: Task[]) => {
  // Check every hour
  const checkInterval = 60 * 60 * 1000; // 1 hour in milliseconds
  
  const intervalId = setInterval(() => {
    checkDailyReminders(tasks);
  }, checkInterval);

  // Initial check
  setTimeout(() => {
    checkDailyReminders(tasks);
  }, 1000);

  return intervalId;
};