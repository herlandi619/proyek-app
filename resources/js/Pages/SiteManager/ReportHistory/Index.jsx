import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SiteManagerLayout from '@/Layouts/SiteManagerLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, reports, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // State Modal Detail
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedReport, setSelectedReport] = useState(null);

    // Handle Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('site-manager.report-history.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Buka Modal Detail
    const openDetailModal = (report) => {
        setSelectedReport(report);
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedReport(null);
    };

    // Zoom Gambar dengan SweetAlert2
    const viewPhoto = (path) => {
        Swal.fire({
            imageUrl: `/storage/${path}`,
            imageAlt: 'Foto Dokumentasi',
            showConfirmButton: false,
            showCloseButton: true,
            width: 'auto',
            backdrop: `rgba(0,0,0,0.85)`,
            customClass: {
                image: 'max-h-[85vh] rounded-md object-contain'
            }
        });
    };

    return (
        <SiteManagerLayout user={auth.user}>
            <Head title="Riwayat Laporan Progres" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header & Search */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Histori Laporan Saya</h3>
                                    <p className="text-sm text-gray-500">Arsip laporan progres dan dokumentasi yang telah Anda kirimkan.</p>
                                </div>
                                
                                <div className="mt-4 md:mt-0 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari laporan, item, atau proyek..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-md shadow-sm w-full md:w-72 text-sm"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200 text-gray-700 transition-colors">
                                            Cari
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tabel Riwayat Laporan */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-blue-50 border-b border-blue-100">
                                        <tr>
                                            <th className="px-6 py-3 w-16">No</th>
                                            <th className="px-6 py-3">Tanggal Laporan</th>
                                            <th className="px-6 py-3">Proyek & Item Pekerjaan</th>
                                            <th className="px-6 py-3 text-center">Persentase</th>
                                            <th className="px-6 py-3 text-center">Lampiran</th>
                                            <th className="px-6 py-3 text-center w-32">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.data.length > 0 ? (
                                            reports.data.map((report, index) => (
                                                <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        {(reports.current_page - 1) * reports.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                                        {report.tanggal_laporan}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-800">{report.work_item?.nama_item}</div>
                                                        <div className="text-xs text-blue-600 mt-1">{report.work_item?.project?.nama_proyek}</div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                                                            {report.persentase_progres}%
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="text-gray-500 text-xs font-medium flex items-center justify-center gap-1">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                            {report.progress_photos?.length || 0} Foto
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button 
                                                            onClick={() => openDetailModal(report)}
                                                            className="text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors text-xs font-medium w-full"
                                                        >
                                                            Lihat Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                                    Belum ada riwayat laporan progres yang ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center">
                                {reports.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (link.url) router.get(link.url);
                                        }}
                                        disabled={!link.url}
                                        className={`px-4 py-2 mx-1 border rounded-md text-sm transition-colors
                                            ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'} 
                                            ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail & Dokumentasi Foto */}
            {isModalOpen && selectedReport && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        
                        {/* Modal Header */}
                        <div className="bg-slate-800 p-5 shrink-0 flex justify-between items-start">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Detail Laporan Progres</h3>
                                <p className="text-slate-300 text-sm">
                                    Tanggal Lapor: <span className="text-white font-medium">{selectedReport.tanggal_laporan}</span>
                                </p>
                            </div>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white transition-colors bg-slate-700 hover:bg-slate-600 p-2 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        {/* Modal Body (Scrollable) */}
                        <div className="p-6 overflow-y-auto grow bg-slate-50 space-y-6">
                            
                            {/* Info Proyek & Progres */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                    <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Informasi Pekerjaan</span>
                                    <div className="font-bold text-gray-900">{selectedReport.work_item?.nama_item}</div>
                                    <div className="text-sm text-blue-600 mt-1">{selectedReport.work_item?.project?.nama_proyek}</div>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
                                    <div>
                                        <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Pencapaian Progres</span>
                                        <div className="text-sm text-gray-600">Total Progres Keseluruhan</div>
                                    </div>
                                    <div className="text-3xl font-black text-green-600">{selectedReport.persentase_progres}%</div>
                                </div>
                            </div>

                            {/* Catatan Laporan */}
                            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                                <h4 className="text-sm font-bold text-gray-800 mb-2 border-b pb-2">Catatan / Deviasi Lapangan</h4>
                                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                                    {selectedReport.catatan || <span className="italic text-gray-400">Tidak ada catatan yang dilampirkan pada laporan ini.</span>}
                                </p>
                            </div>

                            {/* Galeri Foto Dokumentasi */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Dokumentasi Lapangan ({selectedReport.progress_photos?.length || 0} Foto)
                                </h4>
                                
                                {selectedReport.progress_photos && selectedReport.progress_photos.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {selectedReport.progress_photos.map((photo) => (
                                            <div 
                                                key={photo.id}
                                                onClick={() => viewPhoto(photo.path_foto)}
                                                className="aspect-square bg-gray-200 rounded-lg overflow-hidden border border-gray-300 cursor-pointer group relative shadow-sm"
                                            >
                                                <img 
                                                    src={`/storage/${photo.path_foto}`} 
                                                    alt="Dokumentasi" 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=Gambar+Rusak' }}
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-white border border-dashed border-gray-300 rounded-lg">
                                        <p className="text-gray-500 text-sm">Tidak ada foto dokumentasi yang diunggah.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-4 border-t bg-gray-100 shrink-0 flex justify-end">
                            <button 
                                type="button" 
                                onClick={closeModal} 
                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-200 px-6 py-2 rounded-md font-semibold transition-colors shadow-sm"
                            >
                                Tutup Panel
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}
        </SiteManagerLayout>
    );
}