import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, projects, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // State untuk Modal Detail
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Handle Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.monitoring.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Buka Modal Detail Proyek
    const openDetailModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    // Zoom Image via SweetAlert
    const viewImage = (imagePath) => {
        Swal.fire({
            imageUrl: `/storage/${imagePath}`,
            imageAlt: 'Progress Photo',
            showConfirmButton: false,
            showCloseButton: true,
            customClass: {
                image: 'rounded-lg max-h-[80vh] object-contain'
            },
            width: 'auto',
            backdrop: `rgba(0,0,0,0.8)`
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Laporan & Monitoring Proyek" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header & Search */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Monitoring Laporan Proyek</h3>
                                    <p className="text-sm text-gray-500">Pantau progres dan dokumentasi secara real-time</p>
                                </div>
                                
                                <div className="mt-4 md:mt-0 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari proyek / lokasi..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-l-md shadow-sm w-full md:w-72"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200">
                                            Cari
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Table Data Proyek */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 w-12">No</th>
                                            <th className="px-6 py-3">Nama Proyek</th>
                                            <th className="px-6 py-3">Site Manager</th>
                                            <th className="px-6 py-3">Estimasi Selesai</th>
                                            <th className="px-6 py-3 text-center">Status Laporan</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project, index) => {
                                                // Menghitung total laporan di semua item
                                                const totalReports = project.work_items?.reduce((acc, item) => acc + (item.progress_reports?.length || 0), 0);
                                                
                                                return (
                                                    <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-6 py-4">
                                                            {(projects.current_page - 1) * projects.per_page + index + 1}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-bold text-gray-900">{project.nama_proyek}</div>
                                                            <div className="text-xs text-gray-400">{project.lokasi}</div>
                                                        </td>
                                                        <td className="px-6 py-4 font-medium">
                                                            {project.site_manager ? project.site_manager.name : '-'}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {project.estimasi_penyelesaian}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-2 py-1 rounded text-xs font-semibold ${totalReports > 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                                {totalReports > 0 ? `${totalReports} Laporan Masuk` : 'Belum Ada Laporan'}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button 
                                                                onClick={() => openDetailModal(project)}
                                                                className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded transition-colors"
                                                            >
                                                                Lihat Rincian
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data monitoring proyek.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                {projects.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (link.url) router.get(link.url);
                                        }}
                                        disabled={!link.url}
                                        className={`px-4 py-2 mx-1 border rounded text-sm transition-colors
                                            ${link.active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 hover:bg-gray-50'} 
                                            ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Box View Detail (Scrollable) */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-60 transition-opacity p-4">
                    <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                        
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b shrink-0">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedProject.nama_proyek}</h3>
                                <p className="text-sm text-gray-500">Lokasi: {selectedProject.lokasi} | Site Manager: {selectedProject.site_manager?.name || '-'}</p>
                            </div>
                            <button onClick={closeModal} className="text-gray-400 hover:text-red-500 bg-gray-100 p-2 rounded-full transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        {/* Modal Body (Scrollable Area) */}
                        <div className="p-6 overflow-y-auto grow space-y-6 bg-slate-50">
                            {selectedProject.work_items && selectedProject.work_items.length > 0 ? (
                                selectedProject.work_items.map((item) => (
                                    <div key={item.id} className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                        <div className="border-b pb-2 mb-4">
                                            <h4 className="text-lg font-bold text-indigo-700">{item.nama_item}</h4>
                                            {item.deskripsi && <p className="text-sm text-gray-500 mt-1">{item.deskripsi}</p>}
                                        </div>

                                        {/* List Laporan Progress per Item */}
                                        <div className="space-y-4">
                                            {item.progress_reports && item.progress_reports.length > 0 ? (
                                                item.progress_reports.map((report) => (
                                                    <div key={report.id} className="bg-gray-50 rounded-md p-4 border border-gray-100">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                                    Tgl: {report.tanggal_laporan}
                                                                </span>
                                                                <span className="text-xs text-gray-500 ml-2">Dilaporkan oleh: {report.user?.name}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="block text-xl font-bold text-green-600">{report.persentase_progres}%</span>
                                                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Progres</span>
                                                            </div>
                                                        </div>
                                                        
                                                        <p className="text-sm text-gray-700 mt-3 mb-3 p-3 bg-white rounded border border-gray-100 shadow-inner">
                                                            <span className="font-semibold block mb-1">Catatan:</span>
                                                            {report.catatan || <span className="italic text-gray-400">Tidak ada catatan spesifik.</span>}
                                                        </p>

                                                        {/* Galeri Foto Progress */}
                                                        {report.progress_photos && report.progress_photos.length > 0 && (
                                                            <div className="mt-4">
                                                                <span className="text-xs font-semibold text-gray-500 block mb-2 uppercase">Dokumentasi:</span>
                                                                <div className="flex gap-3 overflow-x-auto pb-2">
                                                                    {report.progress_photos.map((photo) => (
                                                                        <div 
                                                                            key={photo.id} 
                                                                            onClick={() => viewImage(photo.path_foto)}
                                                                            className="shrink-0 w-24 h-24 rounded border border-gray-200 overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                                                                        >
                                                                            {/* Pastikan symlink storage link laravel sudah dibuat (php artisan storage:link) */}
                                                                            <img 
                                                                                src={`/storage/${photo.path_foto}`} 
                                                                                alt="Progress" 
                                                                                className="w-full h-full object-cover"
                                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-sm text-gray-400 italic text-center py-4 bg-gray-50 rounded">
                                                    Belum ada riwayat laporan untuk item pekerjaan ini.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-10 bg-white rounded-lg border border-dashed border-gray-300">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    Belum ada item pekerjaan yang dibuat pada proyek ini.
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t bg-gray-50 rounded-b-xl flex justify-end shrink-0">
                            <button 
                                type="button" 
                                onClick={closeModal} 
                                className="bg-white border border-gray-300 text-gray-700 px-5 py-2 rounded hover:bg-gray-100 transition-colors shadow-sm font-medium"
                            >
                                Tutup Panel
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </AdminLayout>
    );
}