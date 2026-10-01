import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, projects, siteManagers, filters }) {
    const { flash } = usePage().props;
    
    // State untuk Search dan Modal
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    // Inertia useForm untuk handle input dan validasi
    const { data, setData, post, put, reset, errors, clearErrors, processing } = useForm({
        nama_proyek: '',
        lokasi: '',
        tanggal_mulai: '',
        estimasi_penyelesaian: '',
        site_manager_id: ''
    });

    // SweetAlert Flash Message Listener (Berhasil dari backend)
    useEffect(() => {
        if (flash?.message) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
    }, [flash]);

    // Handle Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.projects.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Modal Handlers
    const openCreateModal = () => {
        setIsEdit(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setIsEdit(true);
        setCurrentId(project.id);
        setData({
            nama_proyek: project.nama_proyek,
            lokasi: project.lokasi,
            tanggal_mulai: project.tanggal_mulai,
            estimasi_penyelesaian: project.estimasi_penyelesaian,
            site_manager_id: project.site_manager_id
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    // Submit Handler dengan Konfirmasi SweetAlert & preserveScroll
    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: isEdit ? 'Simpan Perubahan?' : 'Tambah Proyek Baru?',
            text: "Pastikan data yang Anda masukkan sudah benar.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5', // Warna Indigo
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                if (isEdit) {
                    put(route('admin.projects.update', currentId), {
                        preserveScroll: true,
                        onSuccess: () => closeModal(),
                        onError: () => {
                            Swal.fire('Gagal!', 'Periksa kembali form isian Anda.', 'error');
                        }
                    });
                } else {
                    post(route('admin.projects.store'), {
                        preserveScroll: true,
                        onSuccess: () => closeModal(),
                        onError: () => {
                            Swal.fire('Gagal!', 'Periksa kembali form isian Anda.', 'error');
                        }
                    });
                }
            }
        });
    };

    // Delete Handler dengan preserveScroll
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Proyek?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.projects.destroy', id), {
                    preserveScroll: true // Mencegah layar scroll ke atas
                });
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Proyek" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header: Title, Search, and Add Button */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">Data Proyek Konstruksi</h3>
                                
                                <div className="flex gap-2 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex flex-1">
                                        <input
                                            type="text"
                                            placeholder="Cari nama / lokasi..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-l-md shadow-sm w-full md:w-64"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200">
                                            Cari
                                        </button>
                                    </form>
                                    <button 
                                        onClick={openCreateModal}
                                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 whitespace-nowrap transition-colors"
                                    >
                                        + Tambah Proyek
                                    </button>
                                </div>
                            </div>

                            {/* Tabel Data Proyek */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3">No</th>
                                            <th className="px-6 py-3">Nama Proyek</th>
                                            <th className="px-6 py-3">Lokasi</th>
                                            <th className="px-6 py-3">Timeline</th>
                                            <th className="px-6 py-3">Site Manager</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project, index) => (
                                                <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        {(projects.current_page - 1) * projects.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">{project.nama_proyek}</td>
                                                    <td className="px-6 py-4">{project.lokasi}</td>
                                                    <td className="px-6 py-4 text-xs">
                                                        {project.tanggal_mulai} <br/> s/d <br/> {project.estimasi_penyelesaian}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {project.site_manager ? project.site_manager.name : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button 
                                                            onClick={() => openEditModal(project)}
                                                            className="text-yellow-600 hover:text-yellow-800 bg-yellow-100 px-3 py-1 rounded mr-2 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(project.id)}
                                                            className="text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded transition-colors"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data proyek ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination Links */}
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

            {/* Modal Box CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 m-4 shadow-xl transform transition-all">
                        <div className="flex justify-between items-center mb-5 border-b pb-3">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEdit ? 'Edit Proyek' : 'Tambah Proyek Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Input Nama Proyek */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Proyek</label>
                                <input
                                    type="text"
                                    value={data.nama_proyek}
                                    onChange={(e) => setData('nama_proyek', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.nama_proyek ? 'border-red-500' : ''}`}
                                />
                                {errors.nama_proyek && <span className="text-red-500 text-xs">{errors.nama_proyek}</span>}
                            </div>

                            {/* Input Lokasi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi Proyek</label>
                                <input
                                    type="text"
                                    value={data.lokasi}
                                    onChange={(e) => setData('lokasi', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.lokasi ? 'border-red-500' : ''}`}
                                />
                                {errors.lokasi && <span className="text-red-500 text-xs">{errors.lokasi}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Input Tanggal Mulai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_mulai}
                                        onChange={(e) => setData('tanggal_mulai', e.target.value)}
                                        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.tanggal_mulai ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tanggal_mulai && <span className="text-red-500 text-xs">{errors.tanggal_mulai}</span>}
                                </div>

                                {/* Input Estimasi Selesai */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimasi Selesai</label>
                                    <input
                                        type="date"
                                        value={data.estimasi_penyelesaian}
                                        onChange={(e) => setData('estimasi_penyelesaian', e.target.value)}
                                        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.estimasi_penyelesaian ? 'border-red-500' : ''}`}
                                    />
                                    {errors.estimasi_penyelesaian && <span className="text-red-500 text-xs">{errors.estimasi_penyelesaian}</span>}
                                </div>
                            </div>

                            {/* Dropdown Site Manager */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tugaskan ke (Site Manager)</label>
                                <select
                                    value={data.site_manager_id}
                                    onChange={(e) => setData('site_manager_id', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.site_manager_id ? 'border-red-500' : ''}`}
                                >
                                    <option value="">-- Pilih Site Manager --</option>
                                    {siteManagers.map((sm) => (
                                        <option key={sm.id} value={sm.id}>{sm.name}</option>
                                    ))}
                                </select>
                                {errors.site_manager_id && <span className="text-red-500 text-xs">{errors.site_manager_id}</span>}
                            </div>

                            {/* Buttons Modal */}
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                >
                                    {processing ? 'Memproses...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}