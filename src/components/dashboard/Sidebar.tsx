import React from 'react';
import { Home, Calendar, Filter, User, BookOpen, Users, GraduationCap, Briefcase } from 'lucide-react';

interface SidebarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
  onViewChange: (view: 'tasks' | 'calendar' | 'profile') => void;
  currentView: string;
}

export function Sidebar({ currentFilter, onFilterChange, onViewChange, currentView }: SidebarProps) {
  const categories = [
    { id: 'Semua', label: 'Semua Tugas', icon: Home, color: 'text-gray-600' },
    { id: 'Kuliah', label: 'Kuliah', icon: BookOpen, color: 'text-blue-600' },
    { id: 'Himpunan', label: 'Himpunan', icon: Users, color: 'text-purple-600' },
    { id: 'Skripsi', label: 'Skripsi', icon: GraduationCap, color: 'text-green-600' },
    { id: 'Kerja', label: 'Kerja', icon: Briefcase, color: 'text-orange-600' },
  ];

  const views = [
    { id: 'tasks', label: 'Tugas', icon: Home },
    { id: 'calendar', label: 'Kalender', icon: Calendar },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className="flex w-48 sm:w-56 lg:w-64 flex-col fixed inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 sidebar-unified">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-2 sm:px-3 lg:px-4">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">TaskFlow</h1>
          </div>

          {/* Navigation Views */}
          <nav className="mt-6 sm:mt-8 flex-1 px-2 sm:px-3 lg:px-4 space-y-1">
            <div className="mb-4">
              <h3 className="px-1 sm:px-2 lg:px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Menu
              </h3>
            </div>
            {views.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id as any)}
                  className={`${
                    currentView === view.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium border-r-2 w-full rounded-lg transition-all`}
                >
                  <Icon className="flex-shrink-0 -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5" />
                  <span className="hidden sm:inline">{view.label}</span>
                </button>
              );
            })}

            {/* Category Filters */}
            {currentView === 'tasks' && (
              <>
                <div className="mt-6 sm:mt-8 mb-4">
                  <h3 className="px-1 sm:px-2 lg:px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <span className="hidden sm:inline">Kategori</span>
                  </h3>
                </div>
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => onFilterChange(category.id)}
                      className={`${
                        currentFilter === category.id
                          ? 'bg-gray-50 text-gray-900 border-r-2 border-blue-500 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-2 sm:px-3 py-2 sm:py-3 text-xs sm:text-sm font-medium w-full rounded-lg transition-all`}
                    >
                      <Icon className={`flex-shrink-0 -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 ${category.color}`} />
                      <span className="hidden sm:inline">{category.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}