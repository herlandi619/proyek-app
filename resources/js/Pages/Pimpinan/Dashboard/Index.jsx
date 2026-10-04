import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import PimpinanLayout from '@/Layouts/PimpinanLayout';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Index({ auth, projects, summary, filters }) {
    const { flash } = usePage().props;
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        if (flash?.message) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.message,
                timer: 2500,
                showConfirmButton: false
            });
            // Tutup modal secara otomatis jika ada aksi validasi sukses
            setIsModalOpen(false);
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pimpinan.dashboard'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    const openDetailModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    // Fungsi kalkulasi progres real-time, HANYA menghitung laporan berstatus 'approved'
    const calculateProjectProgress = (project) => {
        if (!project.work_items || project.work_items.length === 0) return 0;
        
        let totalProgress = 0;
        project.work_items.forEach(item => {
            if (item.progress_reports && item.progress_reports.length > 0) {
                // Saring laporan untuk hanya mengambil yang disetujui
                const approvedReports = item.progress_reports.filter(r => r.status === 'approved');
                if (approvedReports.length > 0) {
                    const latestApprovedReport = approvedReports[approvedReports.length - 1];
                    totalProgress += parseFloat(latestApprovedReport.persentase_progres);
                }
            }
        });

        return parseFloat((totalProgress / project.work_items.length).toFixed(2));
    };

    // Fungsi Aksi Validasi Laporan (Approve/Reject)
    const handleStatusUpdate = (reportId, newStatus) => {
        Swal.fire({
            title: newStatus === 'approved' ? 'Setujui Laporan?' : 'Tolak Laporan?',
            text: newStatus === 'approved' 
                ? "Nilai progres akan ditambahkan secara permanen ke grafik proyek." 
                : "Laporan akan dikembalikan ke Site Manager untuk direvisi.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'approved' ? '#10b981' : '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.put(route('pimpinan.progress-reports.update-status', reportId), {
                    status: newStatus
                }, {
                    preserveScroll: true
                });
            }
        });
    };

    const chartData = projects.data.map((project) => ({
        name: project.nama_proyek.length > 15 ? project.nama_proyek.substring(0, 15) + '...' : project.nama_proyek,
        fullName: project.nama_proyek,
        progres: calculateProjectProgress(project)
    }));

    return (
        <PimpinanLayout user={auth.user}>
            <Head title="Dashboard Laporan Pimpinan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Ringkasan Eksekutif */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Proyek</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.total_projects}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Item Pekerjaan</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.total_work_items}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Progres Tervalidasi (Rata-rata)</p>
                                <p className="text-2xl font-bold text-gray-800">{summary.average_progress}%</p>
                            </div>
                        </div>
                    </div>

                    {/* Grafik Visualisasi Recharts */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Grafik Progres Proyek (Valid)</h3>
                        <div className="w-full h-80">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
                                        <YAxis domain={[0, 100]} unit="%" />
                                        <Tooltip 
                                            formatter={(value) => [`${value}%`, 'Progres']}
                                            labelFormatter={(label, payload) => payload[0] ? payload[0].payload.fullName : label}
                                        />
                                        <Bar dataKey="progres" fill="#3b82f6" radius={[6, 6, 0, 0]}>
                                            {chartData.map((entry, index) => (
                                                <Cell 
                                                    key={`cell-${index}`} 
                                                    fill={entry.progres < 50 ? '#ef4444' : entry.progres < 100 ? '#f59e0b' : '#10b981'} 
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    Belum ada data grafik untuk ditampilkan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Tabel Monitoring */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Monitoring & Validasi Laporan Proyek</h3>
                                
                                <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari proyek / lokasi..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-md shadow-sm w-full md:w-64"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200">
                                            Cari
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tabel Data */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama Proyek</th>
                                            <th className="px-6 py-3">Site Manager</th>
                                            <th className="px-6 py-3">Timeline</th>
                                            <th className="px-6 py-3">Progres (Valid)</th>
                                            <th className="px-6 py-3 text-center">Aksi Validasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project) => {
                                                const currentProgress = calculateProjectProgress(project);
                                                return (
                                                    <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{project.nama_proyek} <br/><span className="text-xs text-gray-400">{project.lokasi}</span></td>
                                                        <td className="px-6 py-4">{project.site_manager?.name || '-'}</td>
                                                        <td className="px-6 py-4 text-xs">
                                                            Mulai: {project.tanggal_mulai} <br/>
                                                            Estimasi: {project.estimasi_penyelesaian}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                                    <div className={`h-2.5 rounded-full ${currentProgress < 50 ? 'bg-red-500' : currentProgress < 100 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${currentProgress}%` }}></div>
                                                                </div>
                                                                <span className="font-semibold">{currentProgress}%</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 flex justify-center gap-2">
                                                            <button 
                                                                onClick={() => openDetailModal(project)} 
                                                                className="text-blue-600 hover:text-blue-800 font-medium bg-blue-100 px-3 py-1 rounded shadow-sm"
                                                            >
                                                                Tinjau Laporan
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center">Data proyek tidak ditemukan</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Component */}
                            <div className="mt-4 flex justify-center">
                                {projects.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (link.url) router.get(link.url);
                                        }}
                                        disabled={!link.url}
                                        className={`px-4 py-2 mx-1 border rounded text-sm ${link.active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 hover:bg-gray-50'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Box View Detail Progress (Approve/Reject) */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white rounded-lg w-full max-w-3xl shadow-xl overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">Validasi Laporan Proyek</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="p-6">
                            <div className="mb-4 pb-4 border-b">
                                <h4 className="font-bold text-lg text-indigo-700">{selectedProject.nama_proyek}</h4>
                                <p className="text-sm text-gray-600 mt-1">Penanggung Jawab (Site Manager): <strong>{selectedProject.site_manager?.name || '-'}</strong></p>
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {selectedProject.work_items && selectedProject.work_items.length > 0 ? (
                                    selectedProject.work_items.map((item, index) => {
                                        // Mengambil laporan terakhir (terlepas statusnya) untuk diverifikasi Pimpinan
                                        const latestReport = item.progress_reports && item.progress_reports.length > 0 
                                            ? item.progress_reports[item.progress_reports.length - 1] 
                                            : null;

                                        return (
                                            <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h5 className="font-bold text-gray-800">{item.nama_item}</h5>
                                                        <p className="text-xs text-gray-500">{item.deskripsi}</p>
                                                    </div>
                                                    {latestReport && (
                                                        <div className="text-right">
                                                            <span className="text-lg font-bold text-blue-600">{latestReport.persentase_progres}%</span>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                {latestReport ? (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                                                            <div>
                                                                <span className="text-gray-500 block">Tanggal Laporan:</span>
                                                                <span className="font-medium text-gray-800">{latestReport.tanggal_laporan}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 block">Status Saat Ini:</span>
                                                                {latestReport.status === 'approved' && <span className="text-green-600 font-bold uppercase text-xs">Disetujui</span>}
                                                                {latestReport.status === 'rejected' && <span className="text-red-600 font-bold uppercase text-xs">Ditolak</span>}
                                                                {(!latestReport.status || latestReport.status === 'pending') && <span className="text-yellow-600 font-bold uppercase text-xs">Menunggu Validasi</span>}
                                                            </div>
                                                        </div>
                                                        <div className="text-sm mb-4">
                                                            <span className="text-gray-500 block">Catatan Deviasi:</span>
                                                            <span className="font-medium text-gray-800 italic">{latestReport.catatan || 'Tidak ada catatan.'}</span>
                                                        </div>

                                                        {/* Tombol Aksi Persetujuan jika status masih Pending */}
                                                        {(!latestReport.status || latestReport.status === 'pending') && (
                                                            <div className="flex gap-2 mt-4 bg-white p-3 rounded border">
                                                                <p className="text-xs text-gray-500 w-full flex items-center">Aksi untuk laporan ini:</p>
                                                                <button 
                                                                    onClick={() => handleStatusUpdate(latestReport.id, 'approved')}
                                                                    className="bg-green-500 text-white px-4 py-1.5 text-sm font-medium rounded hover:bg-green-600 transition-colors whitespace-nowrap"
                                                                >
                                                                    Setujui Laporan
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleStatusUpdate(latestReport.id, 'rejected')}
                                                                    className="bg-red-500 text-white px-4 py-1.5 text-sm font-medium rounded hover:bg-red-600 transition-colors whitespace-nowrap"
                                                                >
                                                                    Tolak Laporan
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                                        <span className="text-xs text-red-500 italic">Site Manager belum menginput laporan untuk item ini.</span>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center text-gray-500 py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                        Belum ada item pekerjaan di proyek ini.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 flex justify-end border-t">
                            <button type="button" onClick={closeModal} className="bg-white border border-gray-300 px-5 py-2 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100">
                                Tutup Panel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </PimpinanLayout>
    );
}