import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, Tag, AlertTriangle } from 'lucide-react';
import { Task } from '../../lib/supabase';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at'>) => void;
  onClose: () => void;
}

export function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'Kuliah' as Task['kategori'],
    prioritas: 'Medium' as Task['prioritas'],
    deadline: '',
    status: 'Belum dikerjakan' as Task['status'],
    deskripsi: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        judul: task.judul,
        kategori: task.kategori,
        prioritas: task.prioritas,
        deadline: task.deadline || '',
        status: task.status,
        deskripsi: task.deskripsi || '',
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Pastikan data sesuai dengan schema
    const cleanData = {
      ...formData,
      deadline: formData.deadline || null,
      deskripsi: formData.deskripsi || ''
    };
    
    console.log('Submitting task data:', cleanData);
    onSubmit(cleanData);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="unified-card w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Tugas' : 'Tambah Tugas Baru'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Tugas *
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => handleChange('judul', e.target.value)}
                className="unified-input pl-10"
                placeholder="Masukkan judul tugas"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={formData.kategori}
                  onChange={(e) => handleChange('kategori', e.target.value)}
                  className="unified-input pl-10"
                >
                  <option value="Kuliah">Kuliah</option>
                  <option value="Himpunan">Himpunan</option>
                  <option value="Skripsi">Skripsi</option>
                  <option value="Kerja">Kerja</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioritas
              </label>
              <div className="relative">
                <AlertTriangle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={formData.prioritas}
                  onChange={(e) => handleChange('prioritas', e.target.value)}
                  className="unified-input pl-10"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                  className="unified-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="unified-input"
              >
                <option value="Belum dikerjakan">Belum dikerjakan</option>
                <option value="Sedang dikerjakan">Sedang dikerjakan</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.deskripsi}
              onChange={(e) => handleChange('deskripsi', e.target.value)}
              rows={4}
              className="unified-input resize-none"
              placeholder="Deskripsi tugas (opsional)"
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 unified-btn-secondary"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 unified-btn-primary"
            >
              {task ? 'Perbarui' : 'Tambah'} Tugas
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}