import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Task } from '../../lib/supabase';
import { format, isSameDay } from 'date-fns';
import { Clock, AlertTriangle } from 'lucide-react';
import 'react-calendar/dist/Calendar.css';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Get tasks for the selected date
  const tasksForSelectedDate = tasks.filter(task => 
    task.deadline && isSameDay(new Date(task.deadline), selectedDate)
  );

  // Get tasks that have deadlines
  const tasksWithDeadlines = tasks.filter(task => task.deadline);

  // Tile content for calendar dates
  const tileContent = ({ date }: { date: Date }) => {
    const dayTasks = tasksWithDeadlines.filter(task => 
      task.deadline && isSameDay(new Date(task.deadline), date)
    );

    if (dayTasks.length === 0) return null;

    return (
      <div className="flex justify-center mt-1">
        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
      </div>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getCategoryColor = (kategori: string) => {
    switch (kategori) {
      case 'Kuliah': return 'bg-blue-100 text-blue-800';
      case 'Himpunan': return 'bg-purple-100 text-purple-800';
      case 'Skripsi': return 'bg-green-100 text-green-800';
      case 'Kerja': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Kalender Tugas</h2>
        
        <div className="calendar-container">
          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileContent={tileContent}
            className="w-full border-none"
          />
        </div>
        
        <div className="mt-4 flex items-center text-sm text-gray-600">
          <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
          <span>Hari dengan tugas deadline</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Tugas untuk {format(selectedDate, 'dd MMMM yyyy')}
        </h3>
        
        {tasksForSelectedDate.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada tugas pada tanggal ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasksForSelectedDate.map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{task.judul}</h4>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className={`h-4 w-4 ${getPriorityColor(task.prioritas)}`} />
                    <span className={`text-sm ${getPriorityColor(task.prioritas)}`}>
                      {task.prioritas}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.kategori)}`}>
                    {task.kategori}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                    task.status === 'Sedang dikerjakan' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </div>
                
                {task.deskripsi && (
                  <p className="text-gray-600 text-sm">{task.deskripsi}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}