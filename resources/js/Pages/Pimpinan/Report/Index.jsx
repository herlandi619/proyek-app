import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import PimpinanLayout from '@/Layouts/PimpinanLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, projects, allProjects, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    
    // State untuk Modal Filter
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // State Form Filter
    const [filterData, setFilterData] = useState({
        project_id: '',
        start_date: '',
        end_date: ''
    });

    // Pencarian Tabel Proyek (Bukan Filter PDF)
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('pimpinan.cetak-laporan.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    const openFilterModal = () => {
        setFilterData({ project_id: '', start_date: '', end_date: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Fungsi Trigger Download PDF
    const handleDownloadPdf = (e) => {
        e.preventDefault();
        
        // Membuka SweetAlert animasi loading
        Swal.fire({
            title: 'Menghasilkan PDF...',
            text: 'Sistem sedang menyusun data dan gambar, mohon tunggu.',
            icon: 'info',
            timer: 2000,
            showConfirmButton: false,
            allowOutsideClick: false
        }).then(() => {
            // URL Builder untuk GET parameter
            const url = route('pimpinan.cetak-laporan.pdf', {
                project_id: filterData.project_id,
                start_date: filterData.start_date,
                end_date: filterData.end_date
            });
            
            // Buka di tab baru untuk trigger native download
            window.open(url, '_blank');
            closeModal();
        });
    };

    return (
        <PimpinanLayout user={auth.user}>
            <Head title="Cetak Laporan Progres" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Panel Instruksi Eksekutif */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg shadow-lg mb-6 p-6 text-white flex flex-col md:flex-row items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Pusat Laporan & Dokumentasi</h2>
                            <p className="text-slate-300 text-sm max-w-2xl">
                                Akses dan unduh riwayat progres proyek beserta bukti dokumentasi foto di lapangan dalam format dokumen resmi (PDF).
                            </p>
                        </div>
                        <button 
                            onClick={openFilterModal}
                            className="mt-4 md:mt-0 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md shadow-md flex items-center gap-2 transition-transform transform hover:scale-105"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Export PDF
                        </button>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header Table & Search */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Daftar Proyek Aktif</h3>
                                <div className="mt-4 md:mt-0 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari referensi proyek..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-l-md shadow-sm w-full md:w-64 text-sm"
                                        />
                                        <button type="submit" className="bg-slate-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-slate-200 text-gray-700 font-medium">
                                            Cari
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tabel Daftar Proyek (Referensi Informasi) */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-slate-50 border-y border-slate-200">
                                        <tr>
                                            <th className="px-6 py-4 w-12">No</th>
                                            <th className="px-6 py-4">Nama Proyek</th>
                                            <th className="px-6 py-4">Lokasi</th>
                                            <th className="px-6 py-4">Site Manager</th>
                                            <th className="px-6 py-4 text-center w-40">Aksi Cepat</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project, index) => (
                                                <tr key={project.id} className="bg-white border-b hover:bg-slate-50">
                                                    <td className="px-6 py-4">
                                                        {(projects.current_page - 1) * projects.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-gray-900">{project.nama_proyek}</td>
                                                    <td className="px-6 py-4">{project.lokasi}</td>
                                                    <td className="px-6 py-4">{project.site_manager?.name || '-'}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        {/* Tombol cetak khusus 1 proyek ini */}
                                                        <button 
                                                            onClick={() => {
                                                                setFilterData({ project_id: project.id, start_date: '', end_date: '' });
                                                                setIsModalOpen(true);
                                                            }}
                                                            className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md font-medium text-xs transition-colors w-full border border-indigo-100"
                                                        >
                                                            Cetak Proyek Ini
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    Tidak ada data proyek ditemukan.
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
                                            ${link.active ? 'bg-slate-800 text-white border-slate-800 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'} 
                                            ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Box Eksekutif - Filter Cetak PDF */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-70 p-4 transition-opacity">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                        
                        <div className="bg-red-700 p-5 shrink-0 text-white flex justify-between items-center relative">
                            <div>
                                <h3 className="text-lg font-bold">Kustomisasi Laporan PDF</h3>
                                <p className="text-red-200 text-xs mt-1">Filter data laporan yang ingin Anda generate.</p>
                            </div>
                            <button onClick={closeModal} className="text-red-200 hover:text-white transition-colors bg-red-800 hover:bg-red-900 p-2 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleDownloadPdf} className="p-6 space-y-5 bg-slate-50">
                            {/* Filter Proyek */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pilih Proyek Spesifik</label>
                                <select
                                    value={filterData.project_id}
                                    onChange={(e) => setFilterData({ ...filterData, project_id: e.target.value })}
                                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                                >
                                    <option value="">Semua Proyek Keseluruhan</option>
                                    {allProjects.map((proj) => (
                                        <option key={proj.id} value={proj.id}>{proj.nama_proyek}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Filter Rentang Tanggal */}
                            <div className="p-4 border border-gray-200 bg-white rounded-lg">
                                <label className="block text-sm font-bold text-gray-700 mb-3 border-b pb-2">Filter Rentang Tanggal Laporan</label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Mulai Dari (Opsional)</label>
                                        <input
                                            type="date"
                                            value={filterData.start_date}
                                            onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Sampai Dengan (Opsional)</label>
                                        <input
                                            type="date"
                                            value={filterData.end_date}
                                            onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Alert Note */}
                            <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
                                <strong>Catatan:</strong> Dokumen PDF yang dihasilkan akan mencakup tabel kemajuan deviasi beserta gambar dokumentasi fisik lapangan. Ukuran file mungkin besar tergantung jumlah foto.
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-200">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-5 py-2 rounded-md font-medium transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 font-bold transition-colors flex items-center gap-2 shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    Generate & Unduh PDF
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </PimpinanLayout>
    );
}