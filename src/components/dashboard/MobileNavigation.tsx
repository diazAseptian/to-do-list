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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        <button
          onClick={() => onViewChange('tasks')}
          className={`flex flex-col items-center justify-center space-y-1 ${
            currentView === 'tasks' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </button>
        
        <button
          onClick={() => onViewChange('calendar')}
          className={`flex flex-col items-center justify-center space-y-1 ${
            currentView === 'calendar' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <Calendar className="h-5 w-5" />
          <span className="text-xs">Kalender</span>
        </button>
        
        <button
          onClick={onAddTask}
          className="flex flex-col items-center justify-center bg-blue-600 text-white rounded-t-2xl mx-1"
        >
          <Plus className="h-6 w-6" />
        </button>
        
        <button
          onClick={onShowFilters}
          className="flex flex-col items-center justify-center space-y-1 text-gray-400"
        >
          <Filter className="h-5 w-5" />
          <span className="text-xs">Filter</span>
        </button>
        
        <button
          onClick={() => onViewChange('profile')}
          className={`flex flex-col items-center justify-center space-y-1 ${
            currentView === 'profile' ? 'text-blue-600' : 'text-gray-400'
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profil</span>
        </button>
      </div>
    </div>
  );
}