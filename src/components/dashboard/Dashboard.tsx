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
import { Plus, Search, SortAsc, Menu, X } from 'lucide-react';
import { requestNotificationPermission, scheduleNotificationCheck } from '../../utils/notifications';

export function Dashboard() {
  const [currentView, setCurrentView] = useState<'tasks' | 'calendar' | 'profile'>('tasks');
  const [currentFilter, setCurrentFilter] = useState('Semua');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  
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
    const headerContent = (
      <div className="flex items-center justify-between mb-6">
        {/* Menu Button - Mobile Only */}
        <button
          onClick={() => setShowSidebar(true)}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="flex-1 lg:flex-none">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {currentView === 'tasks' ? (currentFilter === 'Semua' ? 'Semua Tugas' : currentFilter) : 
             currentView === 'calendar' ? 'Kalender' : 'Profil'}
          </h1>
          {currentView === 'tasks' && (
            <p className="text-sm sm:text-base text-gray-600">
              {filteredTasks.length} dari {tasks.length} tugas
            </p>
          )}
        </div>

        {currentView === 'tasks' && (
          <button
            onClick={handleAddTask}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-colors text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Tambah Tugas</span>
          </button>
        )}
      </div>
    );

    switch (currentView) {
      case 'calendar':
        return (
          <>
            {headerContent}
            <CalendarView tasks={tasks} />
          </>
        );
      case 'profile':
        return (
          <>
            {headerContent}
            <ProfileView />
          </>
        );
      default:
        return (
          <>
            {headerContent}

            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari tugas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="unified-input pl-10"
              />
            </div>

            {/* Tasks Grid */}
            {loading ? (
              <div className="unified-grid">
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
                  className="unified-btn-primary px-6"
                >
                  Tambah Tugas Pertama
                </button>
              </div>
            ) : (
              <div className="unified-grid">
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
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
          onViewChange={setCurrentView}
          currentView={currentView}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)} />
          <div className="relative w-64 h-full bg-white">
            <div className="flex justify-end p-4">
              <button
                onClick={() => setShowSidebar(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="px-4 pb-4">
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentView('tasks')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>📋</span>
                  <span>Tugas</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('calendar')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>📅</span>
                  <span>Kalender</span>
                </button>
                
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span>👤</span>
                  <span>Profil</span>
                </button>
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 px-3">Kategori</p>
                {['Semua', 'Kuliah', 'Himpunan', 'Skripsi', 'Kerja'].map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setCurrentFilter(category);
                      setCurrentView('tasks');
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      currentFilter === category && currentView === 'tasks' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span>{category === 'Semua' ? '📂' : category === 'Kuliah' ? '🎓' : category === 'Himpunan' ? '👥' : category === 'Skripsi' ? '📝' : '💼'}</span>
                    <span>{category}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {renderMainContent()}
        </div>
      </div>



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