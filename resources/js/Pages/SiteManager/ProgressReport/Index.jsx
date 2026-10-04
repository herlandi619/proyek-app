import React, { useState, useEffect } from 'react';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import SiteManagerLayout from '@/Layouts/SiteManagerLayout';
import Swal from 'sweetalert2';

export default function Index({ auth, reports, workItems, filters }) {
    const { flash } = usePage().props;
    
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    const { data, setData, post, delete: destroy, reset, errors, clearErrors, processing } = useForm({
        _method: 'post', 
        work_item_id: '',
        tanggal_laporan: '',
        persentase_progres: '',
        catatan: '',
        foto: null
    });

    useEffect(() => {
        // Handle Success Message
        if (flash?.message) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: flash.message,
                timer: 2000,
                showConfirmButton: false
            });
        }
        // Handle Error Message (Pencegahan Edit/Hapus saat status Approved)
        if (flash?.error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal',
                text: flash.error,
                showConfirmButton: true
            });
        }
    }, [flash]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('site-manager.progress-reports.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setIsEdit(false);
        reset();
        clearErrors();
        setData('_method', 'post');
        setIsModalOpen(true);
    };

    const openEditModal = (report) => {
        setIsEdit(true);
        setCurrentId(report.id);
        setData({
            _method: 'put', 
            work_item_id: report.work_item_id,
            tanggal_laporan: report.tanggal_laporan,
            persentase_progres: report.persentase_progres,
            catatan: report.catatan || '',
            foto: null
        });
        clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
        clearErrors();
    };

    const handleFileChange = (e) => {
        setData('foto', e.target.files);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        Swal.fire({
            title: isEdit ? 'Update Progres?' : 'Simpan Progres?',
            text: "Pastikan persentase dan foto yang diunggah valid.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#2563eb',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ya, Simpan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                const submitRoute = isEdit 
                    ? route('site-manager.progress-reports.update', currentId) 
                    : route('site-manager.progress-reports.store');

                post(submitRoute, {
                    preserveScroll: true,
                    forceFormData: true, 
                    onSuccess: () => closeModal(),
                    onError: () => Swal.fire('Gagal!', 'Periksa kembali isian form Anda.', 'error')
                });
            }
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Hapus Laporan?',
            text: "Data progres dan foto yang terlampir akan dihapus permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                destroy(route('site-manager.progress-reports.destroy', id), {
                    preserveScroll: true
                });
            }
        });
    };

    const viewPhoto = (path) => {
        Swal.fire({
            imageUrl: `/storage/${path}`,
            imageAlt: 'Foto Progres',
            showConfirmButton: false,
            showCloseButton: true,
            width: 'auto',
            backdrop: `rgba(0,0,0,0.8)`
        });
    };

    return (
        <SiteManagerLayout user={auth.user}>
            <Head title="Input Progres Pekerjaan" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header & Search */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Riwayat Progres Pekerjaan</h3>
                                    <p className="text-sm text-gray-500">Laporkan kemajuan deviasi pekerjaan harian Anda.</p>
                                </div>
                                
                                <div className="flex gap-2 mt-4 md:mt-0 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex flex-1">
                                        <input
                                            type="text"
                                            placeholder="Cari item / proyek..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-md shadow-sm w-full md:w-56"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200">
                                            Cari
                                        </button>
                                    </form>
                                    <button 
                                        onClick={openCreateModal}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
                                    >
                                        + Input Progres
                                    </button>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-blue-50 border-b">
                                        <tr>
                                            <th className="px-6 py-3 w-12">No</th>
                                            <th className="px-6 py-3">Proyek & Item Pekerjaan</th>
                                            <th className="px-6 py-3">Tanggal</th>
                                            <th className="px-6 py-3">Persentase</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Dokumentasi</th>
                                            <th className="px-6 py-3 text-center">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reports.data.length > 0 ? (
                                            reports.data.map((report, index) => (
                                                <tr key={report.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4">{(reports.current_page - 1) * reports.per_page + index + 1}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900">{report.work_item?.nama_item}</div>
                                                        <div className="text-xs text-gray-500">{report.work_item?.project?.nama_proyek}</div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">{report.tanggal_laporan}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-blue-600">{report.persentase_progres}%</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {report.status === 'approved' && <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">Disetujui</span>}
                                                        {report.status === 'rejected' && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-bold">Ditolak</span>}
                                                        {(!report.status || report.status === 'pending') && <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-bold">Menunggu Validasi</span>}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex -space-x-2">
                                                            {report.progress_photos?.length > 0 ? (
                                                                report.progress_photos.map((photo) => (
                                                                    <img 
                                                                        key={photo.id}
                                                                        src={`/storage/${photo.path_foto}`}
                                                                        alt="Progress"
                                                                        onClick={() => viewPhoto(photo.path_foto)}
                                                                        className="w-8 h-8 rounded-full border-2 border-white object-cover cursor-pointer hover:z-10"
                                                                    />
                                                                ))
                                                            ) : (
                                                                <span className="text-xs text-gray-400">Tidak ada foto</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center whitespace-nowrap">
                                                        {/* Menyembunyikan tombol Edit & Hapus jika status Approved */}
                                                        {report.status !== 'approved' ? (
                                                            <>
                                                                <button 
                                                                    onClick={() => openEditModal(report)}
                                                                    className="text-yellow-600 hover:text-yellow-800 bg-yellow-100 px-3 py-1 rounded mr-2"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDelete(report.id)}
                                                                    className="text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded"
                                                                >
                                                                    Hapus
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <span className="text-xs text-gray-400 italic">Terkunci (Disetujui)</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                                    Belum ada laporan progres yang diinputkan.
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
                                        className={`px-4 py-2 mx-1 border rounded text-sm transition-colors
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

            {/* Modal Box Form CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-60 p-4">
                    <div className="bg-white rounded-lg w-full max-w-lg shadow-xl overflow-hidden">
                        
                        <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {isEdit ? 'Update Progres Pekerjaan' : 'Input Progres Harian'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Pemilihan Item Pekerjaan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Item Pekerjaan</label>
                                <select
                                    value={data.work_item_id}
                                    onChange={(e) => setData('work_item_id', e.target.value)}
                                    disabled={isEdit} 
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.work_item_id ? 'border-red-500' : ''}`}
                                >
                                    <option value="">-- Pilih Item Pekerjaan --</option>
                                    {workItems.map((item) => (
                                        <option key={item.id} value={item.id}>
                                            {item.project?.nama_proyek} - {item.nama_item}
                                        </option>  
                                    ))}
                                </select> 
                                {errors.work_item_id && <span className="text-red-500 text-xs">{errors.work_item_id}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Tanggal Laporan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_laporan}
                                        onChange={(e) => setData('tanggal_laporan', e.target.value)}
                                        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.tanggal_laporan ? 'border-red-500' : ''}`}
                                    />
                                    {errors.tanggal_laporan && <span className="text-red-500 text-xs">{errors.tanggal_laporan}</span>}
                                </div>

                                {/* Persentase */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Progres (%)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="0 - 100"
                                        value={data.persentase_progres}
                                        onChange={(e) => setData('persentase_progres', e.target.value)}
                                        className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.persentase_progres ? 'border-red-500' : ''}`}
                                    />
                                    {errors.persentase_progres && <span className="text-red-500 text-xs">{errors.persentase_progres}</span>}
                                </div>
                            </div>

                            {/* Catatan / Deviasi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Catatan / Deviasi Pekerjaan</label>
                                <textarea
                                    rows="3"
                                    placeholder="Jelaskan kondisi lapangan, kendala, atau hal penting lainnya..."
                                    value={data.catatan}
                                    onChange={(e) => setData('catatan', e.target.value)}
                                    className={`w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${errors.catatan ? 'border-red-500' : ''}`}
                                ></textarea>
                                {errors.catatan && <span className="text-red-500 text-xs">{errors.catatan}</span>}
                            </div>

                            {/* Unggah Foto Multiple */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unggah Foto Dokumentasi</label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 border border-gray-300 rounded-md p-1"
                                />
                                <p className="text-xs text-gray-400 mt-1">Bisa memilih lebih dari 1 foto (Max 5MB/foto). Biarkan kosong jika tidak ingin mengubah foto pada mode edit.</p>
                                {errors.foto && <span className="text-red-500 text-xs">{errors.foto}</span>}
                                {errors['foto.0'] && <span className="text-red-500 text-xs">{errors['foto.0']}</span>}
                            </div>

                            {/* Buttons Modal */}
                            <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
                                <button 
                                    type="button" 
                                    onClick={closeModal} 
                                    className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100"
                                >
                                    Batal
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SiteManagerLayout>
    );
}