import React from 'react';
import { Calendar, Clock, Edit, Trash2, CheckCircle } from 'lucide-react';
import { Task } from '../../lib/supabase';
import { format, isAfter, isBefore, startOfDay } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusUpdate: (id: string, status: Task['status']) => void;
}

export function TaskCard({ task, onEdit, onDelete, onStatusUpdate }: TaskCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-800';
      case 'Sedang dikerjakan': return 'bg-blue-100 text-blue-800';
      case 'Belum dikerjakan': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isOverdue = task.deadline && isBefore(new Date(task.deadline), startOfDay(new Date())) && task.status !== 'Selesai';
  const isDueSoon = task.deadline && isAfter(new Date(task.deadline), new Date()) && 
    isBefore(new Date(task.deadline), new Date(Date.now() + 24 * 60 * 60 * 1000));

  return (
    <div className={`unified-card p-4 sm:p-6 border-l-4 ${
      isOverdue ? 'border-red-500' : isDueSoon ? 'border-yellow-500' : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">{task.judul}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(task.kategori)}`}>
              {task.kategori}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.prioritas)}`}>
              {task.prioritas}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
              {task.status}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {task.deskripsi && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.deskripsi}</p>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-500">
          {task.deadline && (
            <div className={`flex items-center space-x-1 ${isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : ''}`}>
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(task.deadline), 'dd/MM/yyyy')}</span>
            </div>
          )}
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{format(new Date(task.created_at), 'dd/MM/yyyy')}</span>
          </div>
        </div>

        {task.status !== 'Selesai' && (
          <button
            onClick={() => onStatusUpdate(task.id, 'Selesai')}
            className="flex items-center justify-center space-x-1 text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-lg transition-all self-start sm:self-auto"
          >
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Selesai</span>
          </button>
        )}
      </div>
    </div>
  );
}