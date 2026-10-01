import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, projects, totalProjects, totalUsers, siteManagers, filters }) {
    const { flash } = usePage().props;
    
    // State untuk Search
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Form Inertia Setup
    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        nama_proyek: '',
        lokasi: '',
        tanggal_mulai: '',
        estimasi_penyelesaian: '',
        site_manager_id: ''
    });

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    // SweetAlert Flash Message Listener
    useEffect(() => {
        if (flash?.message) {
            Swal.fire({
                icon: flash.type || 'success',
                title: 'Berhasil!',
                text: flash.message,
                timer: 2500,
                showConfirmButton: false
            });
        }
    }, [flash]);

    // Handle Search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.dashboard'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Modal Handlers
    const openCreateModal = () => {
        setIsEdit(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (project) => {
        setIsEdit(true);
        setEditId(project.id);
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
    };

    // Handle Submit CRUD
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.projects.update', editId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.projects.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Handle Delete
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Data proyek ini akan dihapus secara permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.projects.destroy', id));
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Dashboard Admin" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Ringkasan Statistik */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Proyek</p>
                                <p className="text-2xl font-bold text-gray-800">{totalProjects}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center">
                            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                            </div>
                            <div>
                                <p className="text-gray-500 text-sm font-medium">Total Pengguna</p>
                                <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                            </div>
                        </div>
                    </div>

                    {/* Section Tabel */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Manajemen Proyek</h3>
                                
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
                                    {/* <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                                        + Tambah Proyek
                                    </button> */}
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
                                            <th className="px-6 py-3">Site Manager</th>
                                            {/* <th className="px-6 py-3 text-center">Aksi</th> */}
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
                                                    <td className="px-6 py-4">{project.site_manager?.name || '-'}</td>
                                                    <td className="px-6 py-4 flex justify-center gap-2">
                                                        {/* <button onClick={() => openEditModal(project)} className="text-yellow-600 hover:text-yellow-800 font-medium bg-yellow-100 px-3 py-1 rounded">Edit</button>
                                                        <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-800 font-medium bg-red-100 px-3 py-1 rounded">Hapus</button> */}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center">Data tidak ditemukan</td>
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

            {/* Modal Box CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-lg p-6 m-4 shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Proyek' : 'Tambah Proyek'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Proyek</label>
                                    <input type="text" value={data.nama_proyek} onChange={e => setData('nama_proyek', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    {errors.nama_proyek && <span className="text-red-500 text-xs">{errors.nama_proyek}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                    <input type="text" value={data.lokasi} onChange={e => setData('lokasi', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    {errors.lokasi && <span className="text-red-500 text-xs">{errors.lokasi}</span>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tgl Mulai</label>
                                        <input type="date" value={data.tanggal_mulai} onChange={e => setData('tanggal_mulai', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        {errors.tanggal_mulai && <span className="text-red-500 text-xs">{errors.tanggal_mulai}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Estimasi Selesai</label>
                                        <input type="date" value={data.estimasi_penyelesaian} onChange={e => setData('estimasi_penyelesaian', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                        {errors.estimasi_penyelesaian && <span className="text-red-500 text-xs">{errors.estimasi_penyelesaian}</span>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Site Manager</label>
                                    <select value={data.site_manager_id} onChange={e => setData('site_manager_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="">-- Pilih Site Manager --</option>
                                        {siteManagers.map(sm => (
                                            <option key={sm.id} value={sm.id}>{sm.name}</option>
                                        ))}
                                    </select>
                                    {errors.site_manager_id && <span className="text-red-500 text-xs">{errors.site_manager_id}</span>}
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={closeModal} className="bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Batal
                                </button>
                                <button type="submit" disabled={processing} className="bg-blue-600 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                                    {processing ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
}