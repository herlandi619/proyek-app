import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PimpinanLayout from '@/Layouts/PimpinanLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, projects, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // State Modal Detail
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Handle Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pimpinan.monitoring-proyek.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Buka Modal & Set Data
    const openDetailModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    // Fitur Zoom Gambar via SweetAlert
    const viewPhoto = (path) => {
        Swal.fire({
            imageUrl: `/storage/${path}`,
            imageAlt: 'Dokumentasi Lapangan',
            showConfirmButton: false,
            showCloseButton: true,
            width: 'auto',
            backdrop: `rgba(0,0,0,0.85)`,
            customClass: {
                image: 'max-h-[85vh] rounded-md object-contain'
            }
        });
    };

    // Fungsi Kalkulasi Rata-rata Progres Keseluruhan Proyek
    const calculateOverallProgress = (workItems) => {
        if (!workItems || workItems.length === 0) return 0;
        let totalProgress = 0;
        
        workItems.forEach(item => {
            if (item.progress_reports && item.progress_reports.length > 0) {
                // Ambil laporan terbaru (karena di controller sudah diorder desc)
                const latestReport = item.progress_reports[0];
                totalProgress += parseFloat(latestReport.persentase_progres);
            }
        });
        
        return (totalProgress / workItems.length).toFixed(1);
    };

    return (
        <PimpinanLayout user={auth.user}>
            <Head title="Monitoring Real-Time" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header Eksekutif */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                                        Live Monitoring Proyek
                                    </h3>
                                    <p className="text-sm text-gray-500 mt-1">Pantau kemajuan aktual dan deviasi seluruh proyek perusahaan.</p>
                                </div>
                                
                                <div className="mt-4 md:mt-0 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari Proyek, Lokasi, PIC..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-l-md shadow-sm w-full md:w-72 text-sm"
                                        />
                                        <button type="submit" className="bg-indigo-50 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-indigo-100 text-indigo-700 font-medium transition-colors">
                                            Filter
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tabel Dashboard Proyek */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-y border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 w-12">No</th>
                                            <th className="px-6 py-4">Rincian Proyek</th>
                                            <th className="px-6 py-4">PIC / Site Manager</th>
                                            <th className="px-6 py-4 text-center">Progres Total</th>
                                            <th className="px-6 py-4 text-center">Tenggat Waktu</th>
                                            <th className="px-6 py-4 text-center w-36">Evaluasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project, index) => {
                                                const overallProgress = calculateOverallProgress(project.work_items);
                                                // Logika warna status
                                                let progressColor = 'text-green-600 bg-green-50';
                                                if (overallProgress < 50) progressColor = 'text-red-600 bg-red-50';
                                                else if (overallProgress < 80) progressColor = 'text-yellow-600 bg-yellow-50';

                                                return (
                                                    <tr key={project.id} className="bg-white border-b hover:bg-slate-50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            {(projects.current_page - 1) * projects.per_page + index + 1}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-extrabold text-gray-900 text-base">{project.nama_proyek}</div>
                                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                                {project.lokasi}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-semibold text-gray-800">{project.site_manager?.name || '-'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className={`px-3 py-1.5 rounded-full font-bold text-sm border border-transparent ${progressColor} border-opacity-50`}>
                                                                {overallProgress}%
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 text-center font-medium text-gray-700">
                                                            {project.estimasi_penyelesaian}
                                                        </td>
                                                        <td className="px-6 py-4 text-center">
                                                            <button 
                                                                onClick={() => openDetailModal(project)}
                                                                className="text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded shadow-sm transition-all text-xs font-semibold w-full"
                                                            >
                                                                Tinjau Data
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                    Tidak ada data proyek yang ditemukan.
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
                                        className={`px-4 py-2 mx-1 border rounded-md text-sm transition-colors
                                            ${link.active ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50'} 
                                            ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Box Eksekutif - Rincian Real-Time */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity">
                    <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl">
                        
                        {/* Header Modal - Executive Dashboard Style */}
                        <div className="bg-slate-900 p-6 shrink-0 text-white relative">
                            <div className="flex justify-between items-start pr-8">
                                <div>
                                    <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-2 inline-block">ID: #{selectedProject.id}</span>
                                    <h3 className="text-2xl font-bold mb-1">{selectedProject.nama_proyek}</h3>
                                    <p className="text-slate-400 text-sm flex items-center gap-2">
                                        <span>Lokasi: {selectedProject.lokasi}</span>
                                        <span className="text-slate-600">|</span>
                                        <span>PIC: {selectedProject.site_manager?.name || 'Tidak ada'}</span>
                                        <span className="text-slate-600">|</span>
                                        <span className="text-yellow-400">Tenggat: {selectedProject.estimasi_penyelesaian}</span>
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-400 mb-1 uppercase font-bold">Progres Keseluruhan</div>
                                    <div className="text-4xl font-black text-green-400">{calculateOverallProgress(selectedProject.work_items)}%</div>
                                </div>
                            </div>
                            <button onClick={closeModal} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-red-500 p-2 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        {/* Body Modal (Scrollable Area) */}
                        <div className="p-6 overflow-y-auto grow bg-slate-50 space-y-6">
                            
                            <h4 className="font-bold text-gray-800 text-lg border-b pb-2">Status Item Pekerjaan & Deviasi Lapangan</h4>

                            {selectedProject.work_items && selectedProject.work_items.length > 0 ? (
                                selectedProject.work_items.map((item, idx) => {
                                    // Ambil data laporan terakhir untuk item ini (jika ada)
                                    const latestReport = item.progress_reports && item.progress_reports.length > 0 ? item.progress_reports[0] : null;

                                    return (
                                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="bg-slate-200 text-slate-700 text-xs font-bold px-2 py-0.5 rounded">Item #{idx + 1}</span>
                                                        <h5 className="font-extrabold text-gray-900 text-lg">{item.nama_item}</h5>
                                                    </div>
                                                    <p className="text-sm text-gray-500">{item.deskripsi || 'Tidak ada spesifikasi khusus.'}</p>
                                                </div>
                                                <div className="text-right shrink-0 bg-gray-50 p-3 rounded border">
                                                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Progres Aktual</div>
                                                    <div className={`text-2xl font-black ${latestReport ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {latestReport ? `${latestReport.persentase_progres}%` : '0%'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Rincian Deviasi & Catatan Terbaru */}
                                            {latestReport ? (
                                                <div className="bg-indigo-50 border border-indigo-100 rounded-md p-4">
                                                    <div className="flex justify-between text-xs text-indigo-800 mb-2 font-semibold">
                                                        <span>Update Terakhir: {latestReport.tanggal_laporan}</span>
                                                        <span>Dilaporkan oleh: {latestReport.user?.name}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-800 bg-white p-3 rounded shadow-sm border border-indigo-50">
                                                        <span className="font-bold block mb-1 text-xs uppercase text-gray-500">Catatan Deviasi:</span>
                                                        {latestReport.catatan || <span className="italic text-gray-400">Pekerjaan berjalan sesuai rencana (Tidak ada deviasi).</span>}
                                                    </div>

                                                    {/* Foto Lapangan */}
                                                    {latestReport.progress_photos && latestReport.progress_photos.length > 0 && (
                                                        <div className="mt-4 pt-4 border-t border-indigo-100">
                                                            <span className="font-bold block mb-2 text-xs uppercase text-gray-500">Dokumentasi Terlampir:</span>
                                                            <div className="flex gap-3 overflow-x-auto pb-2">
                                                                {latestReport.progress_photos.map((photo) => (
                                                                    <img 
                                                                        key={photo.id}
                                                                        src={`/storage/${photo.path_foto}`}
                                                                        alt="Dokumentasi"
                                                                        onClick={() => viewPhoto(photo.path_foto)}
                                                                        className="h-20 w-32 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 hover:shadow-md transition-all"
                                                                        title="Klik untuk memperbesar"
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded">
                                                    <span className="font-bold mr-1">Info:</span> Belum ada data progres yang dilaporkan oleh Site Manager untuk item ini.
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 bg-white border-2 border-dashed border-gray-300 rounded-lg">
                                    <p className="text-gray-500 font-medium">Belum ada rincian item pekerjaan (RAB/Jadwal) yang didaftarkan untuk proyek ini.</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t bg-gray-100 shrink-0 flex justify-end">
                            <button 
                                onClick={closeModal} 
                                className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-200 px-6 py-2 rounded-md font-bold transition-colors shadow-sm"
                            >
                                Tutup Panel
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}
        </PimpinanLayout>
    );
}