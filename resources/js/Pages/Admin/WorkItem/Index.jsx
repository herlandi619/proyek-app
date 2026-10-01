import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, workItems, projects, filters }) {
    const { flash } = usePage().props;
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const { data, setData, post, put, reset, errors, clearErrors, processing } = useForm({
        project_id: '',
        nama_item: '',
        deskripsi: ''
    });

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

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.work-items.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setIsEdit(false);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setIsEdit(true);
        setCurrentId(item.id);
        setData({
            project_id: item.project_id,
            nama_item: item.nama_item,
            deskripsi: item.deskripsi || ''
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: isEdit ? 'Simpan Perubahan?' : 'Tambah Item Baru?',
            text: "Pastikan rincian item pekerjaan dan pilihan proyek sudah sesuai.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                if (isEdit) {
                    put(route('admin.work-items.update', currentId), {
                        preserveScroll: true,
                        onSuccess: () => closeModal(),
                        onError: () => Swal.fire('Gagal!', 'Periksa kembali form isian Anda.', 'error')
                    });
                } else {
                    post(route('admin.work-items.store'), {
                        preserveScroll: true,
                        onSuccess: () => closeModal(),
                        onError: () => Swal.fire('Gagal!', 'Periksa kembali form isian Anda.', 'error')
                    });
                }
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Item Pekerjaan?',
            text: "Data yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('admin.work-items.destroy', id), {
                    preserveScroll: true
                });
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Item Pekerjaan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Manajemen Item Pekerjaan</h3>
                                    <p className="text-sm text-gray-500 mt-1">Tambahkan rincian pekerjaan pada proyek agar Site Manager dapat menginput progres.</p>
                                </div>
                                
                                <div className="mt-4 md:mt-0 flex gap-2 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex flex-1">
                                        <input
                                            type="text"
                                            placeholder="Cari item / proyek..."
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
                                        + Tambah Item
                                    </button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 w-16">No</th>
                                            <th className="px-6 py-3">Proyek Terkait</th>
                                            <th className="px-6 py-3">Nama Pekerjaan</th>
                                            <th className="px-6 py-3">Deskripsi</th>
                                            <th className="px-6 py-3 text-center w-48">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {workItems.data.length > 0 ? (
                                            workItems.data.map((item, index) => (
                                                <tr key={item.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        {(workItems.current_page - 1) * workItems.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {item.project ? item.project.nama_proyek : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 font-semibold text-indigo-700">
                                                        {item.nama_item}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {item.deskripsi || <span className="text-gray-400 italic">Tidak ada deskripsi</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button 
                                                            onClick={() => openEditModal(item)}
                                                            className="text-yellow-600 hover:text-yellow-800 bg-yellow-100 px-3 py-1 rounded mr-2 transition-colors"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded transition-colors"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                                    Tidak ada data item pekerjaan ditemukan.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="mt-6 flex justify-center">
                                {workItems.links.map((link, index) => (
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50 transition-opacity p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg shadow-xl transform transition-all overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {isEdit ? 'Edit Item Pekerjaan' : 'Tambah Item Baru'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Proyek Konstruksi</label>
                                <select
                                    value={data.project_id}
                                    onChange={(e) => setData('project_id', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.project_id ? 'border-red-500' : ''}`}
                                >
                                    <option value="">-- Pilih Proyek Terkait --</option>
                                    {projects.map((proj) => (
                                        <option key={proj.id} value={proj.id}>{proj.nama_proyek}</option>
                                    ))}
                                </select>
                                {errors.project_id && <span className="text-red-500 text-xs">{errors.project_id}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Item Pekerjaan</label>
                                <input
                                    type="text"
                                    placeholder="Contoh: Pembersihan Lahan, Pekerjaan Dinding"
                                    value={data.nama_item}
                                    onChange={(e) => setData('nama_item', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.nama_item ? 'border-red-500' : ''}`}
                                />
                                {errors.nama_item && <span className="text-red-500 text-xs">{errors.nama_item}</span>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi / Detail Pekerjaan (Opsional)</label>
                                <textarea
                                    rows="3"
                                    placeholder="Jelaskan detail spesifikasi dari item pekerjaan ini..."
                                    value={data.deskripsi}
                                    onChange={(e) => setData('deskripsi', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 ${errors.deskripsi ? 'border-red-500' : ''}`}
                                ></textarea>
                                {errors.deskripsi && <span className="text-red-500 text-xs">{errors.deskripsi}</span>}
                            </div>

                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[120px]"
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