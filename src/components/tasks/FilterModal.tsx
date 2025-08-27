import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';

interface FilterModalProps {
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  status: string;
  prioritas: string;
  kategori: string;
  sortBy: string;
}

export function FilterModal({ onClose, onApplyFilters, currentFilters }: FilterModalProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      status: 'Semua',
      prioritas: 'Semua',
      kategori: 'Semua',
      sortBy: 'terbaru',
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end lg:items-center lg:justify-center p-4 z-50">
      <div className="bg-white rounded-t-2xl lg:rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Filter & Urutkan</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Semua', 'Belum dikerjakan', 'Sedang dikerjakan', 'Selesai'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters(prev => ({ ...prev, status }))}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    filters.status === status
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Prioritas
            </label>
            <div className="grid grid-cols-2 gap-2">
              {['Semua', 'High', 'Medium', 'Low'].map((prioritas) => (
                <button
                  key={prioritas}
                  onClick={() => setFilters(prev => ({ ...prev, prioritas }))}
                  className={`p-3 text-sm rounded-lg border transition-colors ${
                    filters.prioritas === prioritas
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {prioritas}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Urutkan berdasarkan
            </label>
            <div className="space-y-2">
              {[
                { value: 'terbaru', label: 'Terbaru' },
                { value: 'deadline', label: 'Deadline terdekat' },
                { value: 'prioritas', label: 'Prioritas tinggi' },
                { value: 'judul', label: 'Judul A-Z' },
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => setFilters(prev => ({ ...prev, sortBy: sort.value }))}
                  className={`w-full p-3 text-sm text-left rounded-lg border transition-colors ${
                    filters.sortBy === sort.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleReset}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}