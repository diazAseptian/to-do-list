import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { Task } from '../lib/supabase';
import { format } from 'date-fns';

export const exportToPDF = (tasks: Task[]) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('Daftar Tugas', 20, 20);
  
  // Date
  doc.setFontSize(12);
  doc.text(`Tanggal Export: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 35);
  
  let y = 50;
  const lineHeight = 8;
  const pageHeight = doc.internal.pageSize.height;
  
  tasks.forEach((task, index) => {
    // Check if we need a new page
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 20;
    }
    
    // Task number
    doc.setFontSize(14);
    doc.text(`${index + 1}. ${task.judul}`, 20, y);
    y += lineHeight;
    
    // Task details
    doc.setFontSize(10);
    doc.text(`Kategori: ${task.kategori}`, 25, y);
    y += lineHeight - 2;
    
    doc.text(`Prioritas: ${task.prioritas}`, 25, y);
    y += lineHeight - 2;
    
    doc.text(`Status: ${task.status}`, 25, y);
    y += lineHeight - 2;
    
    if (task.deadline) {
      doc.text(`Deadline: ${format(new Date(task.deadline), 'dd/MM/yyyy')}`, 25, y);
      y += lineHeight - 2;
    }
    
    if (task.deskripsi && task.deskripsi.trim()) {
      doc.text(`Deskripsi: ${task.deskripsi}`, 25, y);
      y += lineHeight - 2;
    }
    
    y += lineHeight; // Extra space between tasks
  });
  
  // Save the PDF
  doc.save(`daftar-tugas-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};

export const exportToExcel = (tasks: Task[]) => {
  // Prepare data for Excel
  const excelData = tasks.map((task) => ({
    'Judul': task.judul,
    'Kategori': task.kategori,
    'Prioritas': task.prioritas,
    'Status': task.status,
    'Deadline': task.deadline ? format(new Date(task.deadline), 'dd/MM/yyyy') : '',
    'Deskripsi': task.deskripsi || '',
    'Dibuat': format(new Date(task.created_at), 'dd/MM/yyyy HH:mm'),
  }));
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const colWidths = [
    { wch: 30 }, // Judul
    { wch: 15 }, // Kategori
    { wch: 10 }, // Prioritas
    { wch: 20 }, // Status
    { wch: 12 }, // Deadline
    { wch: 50 }, // Deskripsi
    { wch: 18 }, // Dibuat
  ];
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Daftar Tugas');
  
  // Save the Excel file
  XLSX.writeFile(wb, `daftar-tugas-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
};