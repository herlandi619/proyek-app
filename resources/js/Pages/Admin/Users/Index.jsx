import React, { useState, useEffect } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, users, roles, filters }) {
    const { flash } = usePage().props;
    
    // State untuk Pencarian
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Setup useForm Inertia
    const { data, setData, post, put, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        name: '',
        email: '',
        password: '',
        role_id: ''
    });

    // State Modal
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

    // Handle Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Modal Handlers
    const openCreateModal = () => {
        setIsEdit(false);
        setEditId(null);
        reset();
        clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (user) => {
        setIsEdit(true);
        setEditId(user.id);
        setData({
            name: user.name,
            email: user.email,
            password: '', // Kosongkan password saat edit
            role_id: user.role_id
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    // Handle Submit Form
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.users.update', editId), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.users.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    // Handle Hapus
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Pengguna?',
            text: "Aksi ini tidak dapat dibatalkan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('admin.users.destroy', id));
            }
        });
    };

    return (
        <AdminLayout user={auth.user}>
            <Head title="Manajemen Pengguna" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800">Data Pengguna</h3>
                                
                                <div className="flex gap-4 w-full md:w-auto mt-4 md:mt-0">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari nama atau email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-md shadow-sm w-full md:w-64"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200">
                                            Cari
                                        </button>
                                    </form>
                                    <button onClick={openCreateModal} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium">
                                        + Tambah Pengguna
                                    </button>
                                </div>
                            </div>

                            {/* Tabel Pengguna */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3">Nama Lengkap</th>
                                            <th className="px-6 py-3">Email</th>
                                            <th className="px-6 py-3">Role</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.length > 0 ? (
                                            users.data.map((user) => (
                                                <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                                    <td className="px-6 py-4">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.role.name === 'Admin' ? 'bg-purple-100 text-purple-800' : user.role.name === 'Site Manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                                                            {user.role.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 flex justify-center gap-2">
                                                        <button onClick={() => openEditModal(user)} className="text-yellow-600 hover:text-yellow-800 font-medium bg-yellow-100 px-3 py-1 rounded">Edit</button>
                                                        {auth.user.id !== user.id && ( // Mencegah user menghapus dirinya sendiri
                                                            <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 font-medium bg-red-100 px-3 py-1 rounded">Hapus</button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center">Data pengguna tidak ditemukan</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4 flex justify-center">
                                {users.links.map((link, index) => (
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

            {/* Modal CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6 m-4 shadow-xl">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-xl font-bold text-gray-900">{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    {errors.email && <span className="text-red-500 text-xs">{errors.email}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password {isEdit && <span className="text-xs text-gray-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>}
                                    </label>
                                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                                    {errors.password && <span className="text-red-500 text-xs">{errors.password}</span>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Peran (Role)</label>
                                    <select value={data.role_id} onChange={e => setData('role_id', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                                        <option value="">-- Pilih Peran --</option>
                                        {roles.map(role => (
                                            <option key={role.id} value={role.id}>{role.name}</option>
                                        ))}
                                    </select>
                                    {errors.role_id && <span className="text-red-500 text-xs">{errors.role_id}</span>}
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