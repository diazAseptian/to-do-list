import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, LogOut, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import toast from 'react-hot-toast';

export function ProfileView() {
  const { user, signOut } = useAuth();
  const { tasks } = useTasks();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      const { error } = await signOut();
      if (error) {
        toast.error('Gagal logout');
      } else {
        toast.success('Berhasil logout');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      toast.loading('Mengexport ke PDF...');
      await exportToPDF(tasks);
      toast.dismiss();
      toast.success('PDF berhasil didownload');
    } catch (error) {
      toast.dismiss();
      toast.error('Gagal export PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      toast.loading('Mengexport ke Excel...');
      await exportToExcel(tasks);
      toast.dismiss();
      toast.success('Excel berhasil didownload');
    } catch (error) {
      toast.dismiss();
      toast.error('Gagal export Excel');
    }
  };

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'Selesai').length,
    inProgress: tasks.filter(t => t.status === 'Sedang dikerjakan').length,
    pending: tasks.filter(t => t.status === 'Belum dikerjakan').length,
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profil Pengguna</h2>
            <p className="text-gray-600">Kelola akun dan data Anda</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
            <Mail className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Tugas</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
            <div className="text-sm text-gray-600">Total Tugas</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-sm text-gray-600">Selesai</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-xl">
            <div className="text-2xl font-bold text-yellow-600">{taskStats.inProgress}</div>
            <div className="text-sm text-gray-600">Sedang Dikerjakan</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-xl">
            <div className="text-2xl font-bold text-gray-600">{taskStats.pending}</div>
            <div className="text-sm text-gray-600">Belum Dikerjakan</div>
          </div>
        </div>
      </div>

      {/* Export Data Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Download className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Download data tugas Anda dalam format PDF atau Excel
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportPDF}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-5 w-5 text-red-600" />
            <span>Export ke PDF</span>
          </button>
          
          <button
            onClick={handleExportExcel}
            className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <span>Export ke Excel</span>
          </button>
        </div>
      </div>

      {/* Logout Card */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 p-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          <span>{loading ? 'Memproses...' : 'Keluar'}</span>
        </button>
      </div>
    </div>
  );
}