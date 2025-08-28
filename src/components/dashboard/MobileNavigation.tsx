import React from 'react';
import { Home, Calendar, Plus, Filter, User } from 'lucide-react';

interface MobileNavigationProps {
  currentView: string;
  onViewChange: (view: 'tasks' | 'calendar' | 'profile') => void;
  onAddTask: () => void;
  onShowFilters: () => void;
}

export function MobileNavigation({ currentView, onViewChange, onAddTask, onShowFilters }: MobileNavigationProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="grid grid-cols-5 h-16">
        <button
          onClick={() => onViewChange('tasks')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentView === 'tasks' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs font-medium">Home</span>
        </button>
        
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentView === 'calendar' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs font-medium">Kalender</span>
        </button>
        
        <button
          onClick={onAddTask}
          className="flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-t-2xl mx-1 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </button>
        
        <button
          onClick={onShowFilters}
          className="flex flex-col items-center justify-center space-y-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Filter className="h-5 w-5" />
          <span className="text-xs font-medium">Filter</span>
        </button>
        
        <button
          onClick={() => onViewChange('profile')}
          className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
            currentView === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs font-medium">Profil</span>
        </button>
      </div>
    </div>
  );
}