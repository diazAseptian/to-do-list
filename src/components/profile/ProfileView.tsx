import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Mail, LogOut, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import { LogoutModal } from '../auth/LogoutModal';
import toast from 'react-hot-toast';

export function ProfileView() {
  const { user, signOut } = useAuth();
  const { tasks } = useTasks();
  const [loading, setLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    
    try {
      const { error } = await signOut();
      
      setShowLogoutModal(false);
      
      if (error) {
        console.error('Logout error:', error);
        toast.error('Logout berhasil');
      } else {
        toast.success('Berhasil logout');
      }
    } catch (error: any) {
      console.error('Unexpected logout error:', error);
      setShowLogoutModal(false);
      toast.success('Logout berhasil');
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
      <div className="unified-card unified-spacing">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Profil Pengguna</h2>
            <p className="text-sm sm:text-base text-gray-600">Kelola akun dan data Anda</p>
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
      <div className="unified-card unified-spacing">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Statistik Tugas</h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center p-3 sm:p-4 bg-blue-50 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{taskStats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Tugas</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-green-50 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{taskStats.completed}</div>
            <div className="text-xs sm:text-sm text-gray-600">Selesai</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{taskStats.inProgress}</div>
            <div className="text-xs sm:text-sm text-gray-600">Sedang Dikerjakan</div>
          </div>
          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="text-xl sm:text-2xl font-bold text-gray-600">{taskStats.pending}</div>
            <div className="text-xs sm:text-sm text-gray-600">Belum Dikerjakan</div>
          </div>
        </div>
      </div>

      {/* Export Data Card */}
      <div className="unified-card unified-spacing">
        <div className="flex items-center space-x-2 mb-4">
          <Download className="h-5 w-5 text-gray-600" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Export Data</h3>
        </div>
        
        <p className="text-gray-600 mb-4">
          Download data tugas Anda dalam format PDF atau Excel
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExportPDF}
            className="unified-btn-secondary flex items-center justify-center space-x-2"
          >
            <FileText className="h-5 w-5 text-red-600" />
            <span>Export ke PDF</span>
          </button>
          
          <button
            onClick={handleExportExcel}
            className="unified-btn-secondary flex items-center justify-center space-x-2"
          >
            <FileSpreadsheet className="h-5 w-5 text-green-600" />
            <span>Export ke Excel</span>
          </button>
        </div>
      </div>

      {/* Logout Card */}
      <div className="unified-card unified-spacing">
        <button
          onClick={() => setShowLogoutModal(true)}
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleSignOut}
        loading={loading}
      />
    </div>
  );
}