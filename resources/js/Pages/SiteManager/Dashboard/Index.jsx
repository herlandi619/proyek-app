import React, { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import SiteManagerLayout from '@/Layouts/SiteManagerLayout';
import Swal from 'sweetalert2';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function Index({ auth, projects, totalProyekSaya, totalLaporanSaya, projectStats, filters }) {
    const { flash } = usePage().props;
    
    // State untuk Search
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // State Modal Detail Proyek
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // SweetAlert Listener (jika ada pesan sukses dari aksi lain)
    useEffect(() => {
        if (flash?.message) {
            Swal.fire({
                icon: flash.type || 'success',
                title: 'Informasi',
                text: flash.message,
                timer: 2500,
                showConfirmButton: false
            });
        }
    }, [flash]);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('site-manager.dashboard'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Modal Handlers
    const openDetailModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    // Menyiapkan data untuk Recharts (Simulasi persentase progres per project stats, bisa diganti nilai aslinya dari DB)
    const chartData = projectStats.map((stat) => ({
        name: stat.nama_proyek.length > 15 ? stat.nama_proyek.substring(0, 15) + '...' : stat.nama_proyek,
        fullName: stat.nama_proyek,
        deadline: stat.estimasi_penyelesaian,
        progres: 45 // Nilai dummy progress bar, sesuaikan dengan kalkulasi data asli jika sudah ada
    }));

    return (
        <SiteManagerLayout user={auth.user}>
            <Head title="Dashboard Site Manager" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Ringkasan Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Proyek Saya</p>
                                <p className="text-2xl font-bold text-gray-800">{totalProyekSaya}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Laporan Dikirim</p>
                                <p className="text-2xl font-bold text-gray-800">{totalLaporanSaya}</p>
                            </div>
                        </div>
                    </div>

                    {/* Grafik Visualisasi Recharts untuk Site Manager */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Grafik Timeline & Progres Proyek Saya</h3>
                        <div className="w-full h-80">
                            {chartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 25 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 12 }} />
                                        <YAxis domain={[0, 100]} unit="%" />
                                        <Tooltip 
                                            formatter={(value) => [`${value}%`, 'Progres']}
                                            labelFormatter={(label, payload) => payload[0] ? `${payload[0].payload.fullName} (Deadline: ${payload[0].payload.deadline})` : label}
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
                                    Belum ada proyek yang ditugaskan.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Section Tabel Proyek */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Daftar Proyek Penugasan</h3>
                                
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
                                            <th className="px-6 py-3">Lokasi</th>
                                            <th className="px-6 py-3">Tgl Mulai</th>
                                            <th className="px-6 py-3">Estimasi Selesai</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project) => (
                                                <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{project.nama_proyek}</td>
                                                    <td className="px-6 py-4">{project.lokasi}</td>
                                                    <td className="px-6 py-4">{project.tanggal_mulai}</td>
                                                    <td className="px-6 py-4">{project.estimasi_penyelesaian}</td>
                                                    <td className="px-6 py-4 flex justify-center gap-2">
                                                        <button 
                                                            onClick={() => openDetailModal(project)} 
                                                            className="text-blue-600 hover:text-blue-800 font-medium bg-blue-100 px-3 py-1 rounded"
                                                        >
                                                            Lihat Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
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

            {/* Modal Box View Detail (Read-Only) */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 m-4 shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-900">Detail Proyek</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <div className="space-y-4 text-sm">
                            <div>
                                <label className="block font-medium text-gray-500">Nama Proyek</label>
                                <p className="text-gray-900 font-semibold">{selectedProject.nama_proyek}</p>
                            </div>
                            <div>
                                <label className="block font-medium text-gray-500">Lokasi</label>
                                <p className="text-gray-900">{selectedProject.lokasi}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-medium text-gray-500">Tgl Mulai</label>
                                    <p className="text-gray-900">{selectedProject.tanggal_mulai}</p>
                                </div>
                                <div>
                                    <label className="block font-medium text-gray-500">Estimasi Selesai</label>
                                    <p className="text-gray-900">{selectedProject.estimasi_penyelesaian}</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button type="button" onClick={closeModal} className="bg-gray-100 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </SiteManagerLayout>
    );
}