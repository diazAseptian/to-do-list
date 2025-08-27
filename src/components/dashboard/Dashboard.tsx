import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { TaskCard } from '../tasks/TaskCard';
import { TaskForm } from '../tasks/TaskForm';
import { FilterModal, FilterOptions } from '../tasks/FilterModal';
import { CalendarView } from '../calendar/CalendarView';
import { ProfileView } from '../profile/ProfileView';
import { useTasks } from '../../hooks/useTasks';
import { Task } from '../../lib/supabase';
import { Plus, Search, SortAsc } from 'lucide-react';
import { requestNotificationPermission, scheduleNotificationCheck } from '../../utils/notifications';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<'tasks' | 'calendar' | 'profile'>('tasks');
  const [currentFilter, setCurrentFilter] = useState('Semua');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'Semua',
    prioritas: 'Semua',
    kategori: 'Semua',
    sortBy: 'terbaru',
  });

  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks();

  // Request notification permission and setup reminders
  useEffect(() => {
    const setupNotifications = async () => {
      const permitted = await requestNotificationPermission();
      if (permitted && tasks.length > 0) {
        const intervalId = scheduleNotificationCheck(tasks);
        return () => clearInterval(intervalId);
      }
    };

    setupNotifications();
  }, [tasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.deskripsi?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter from sidebar
    if (currentFilter !== 'Semua') {
      filtered = filtered.filter(task => task.kategori === currentFilter);
    }

    // Apply filters from filter modal
    if (filters.status !== 'Semua') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.prioritas !== 'Semua') {
      filtered = filtered.filter(task => task.prioritas === filters.prioritas);
    }

    if (filters.kategori !== 'Semua') {
      filtered = filtered.filter(task => task.kategori === filters.kategori);
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'deadline':
        filtered.sort((a, b) => {
          if (!a.deadline && !b.deadline) return 0;
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        });
        break;
      case 'prioritas':
        const priorityOrder = { High: 0, Medium: 1, Low: 2 };
        filtered.sort((a, b) => priorityOrder[a.prioritas] - priorityOrder[b.prioritas]);
        break;
      case 'judul':
        filtered.sort((a, b) => a.judul.localeCompare(b.judul));
        break;
      default: // terbaru
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return filtered;
  }, [tasks, currentFilter, filters, searchQuery]);

  const handleTaskSubmit = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask(taskData);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      deleteTask(id);
    }
  };

  const handleStatusUpdate = (id: string, status: Task['status']) => {
    updateTask(id, { status });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const renderMainContent = () => {
    switch (currentView) {
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'profile':
        return <ProfileView />;
      default:
        return (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentFilter === 'Semua' ? 'Semua Tugas' : currentFilter}
                </h1>
                <p className="text-gray-600">
                  {filteredTasks.length} dari {tasks.length} tugas
                </p>
              </div>

              {/* Desktop Add Button */}
              <button
                onClick={handleAddTask}
                className="hidden lg:flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Tambah Tugas</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Tasks Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-xl h-48 animate-pulse" />
                ))}
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada tugas</h3>
                <p className="text-gray-600 mb-4">Mulai dengan menambahkan tugas baru</p>
                <button
                  onClick={handleAddTask}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Tambah Tugas Pertama
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onStatusUpdate={handleStatusUpdate}
                  />
                ))}
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar
        currentFilter={currentFilter}
        onFilterChange={setCurrentFilter}
        onViewChange={setCurrentView}
        currentView={currentView}
      />

      {/* Main Content */}
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-4 lg:p-8">
          {renderMainContent()}
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddTask={handleAddTask}
        onShowFilters={() => setShowFilterModal(true)}
      />

      {/* Floating Add Button (Mobile) */}
      {currentView === 'tasks' && (
        <button
          onClick={handleAddTask}
          className="lg:hidden fixed bottom-20 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center z-40"
        >
          <Plus className="h-6 w-6" />
        </button>
      )}

      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {showFilterModal && (
        <FilterModal
          currentFilters={filters}
          onApplyFilters={setFilters}
          onClose={() => setShowFilterModal(false)}
        />
      )}
    </div>
  );
}