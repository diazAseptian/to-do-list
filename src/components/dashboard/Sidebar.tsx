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
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
          </div>

          {/* Navigation Views */}
          <nav className="mt-8 flex-1 px-4 space-y-1">
            <div className="mb-4">
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
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
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-3 py-2 text-sm font-medium border-r-2 w-full rounded-lg transition-colors`}
                >
                  <Icon className="flex-shrink-0 -ml-1 mr-3 h-5 w-5" />
                  {view.label}
                </button>
              );
            })}

            {/* Category Filters */}
            {currentView === 'tasks' && (
              <>
                <div className="mt-8 mb-4">
                  <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Kategori
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
                          ? 'bg-gray-50 text-gray-900 border-r-2 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } group flex items-center px-3 py-2 text-sm font-medium w-full rounded-lg transition-colors`}
                    >
                      <Icon className={`flex-shrink-0 -ml-1 mr-3 h-5 w-5 ${category.color}`} />
                      {category.label}
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