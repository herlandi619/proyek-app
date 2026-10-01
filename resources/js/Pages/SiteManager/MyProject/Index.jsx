import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import SiteManagerLayout from '@/Layouts/SiteManagerLayout';

export default function Index({ auth, projects, filters }) {
    // State Pencarian dan Modal
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    // Handle Pencarian
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('site-manager.my-projects.index'), { search: searchTerm }, { preserveState: true, replace: true });
    };

    // Buka Modal Detail Proyek & Item Pekerjaan
    const openDetailModal = (project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    // Tutup Modal
    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    return (
        <SiteManagerLayout user={auth.user}>
            <Head title="Proyek Saya" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-100">
                        <div className="p-6 text-gray-900">
                            
                            {/* Header: Title & Search */}
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">Daftar Proyek Penugasan Saya</h3>
                                    <p className="text-sm text-gray-500">Kelola dan pantau rincian proyek yang menjadi tanggung jawab Anda.</p>
                                </div>
                                
                                <div className="mt-4 md:mt-0 w-full md:w-auto">
                                    <form onSubmit={handleSearch} className="flex">
                                        <input
                                            type="text"
                                            placeholder="Cari nama proyek / lokasi..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-l-md shadow-sm w-full md:w-72"
                                        />
                                        <button type="submit" className="bg-gray-100 border border-l-0 border-gray-300 px-4 rounded-r-md hover:bg-gray-200 text-gray-700">
                                            Cari
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Tabel Data Proyek Saya */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500">
                                    <thead className="text-xs text-gray-700 uppercase bg-blue-50 border-b border-blue-100">
                                        <tr>
                                            <th className="px-6 py-3 w-16">No</th>
                                            <th className="px-6 py-3">Rincian Proyek</th>
                                            <th className="px-6 py-3">Timeline</th>
                                            <th className="px-6 py-3 text-center">Total Item Pekerjaan</th>
                                            <th className="px-6 py-3 text-center w-40">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.data.length > 0 ? (
                                            projects.data.map((project, index) => (
                                                <tr key={project.id} className="bg-white border-b hover:bg-gray-50">
                                                    <td className="px-6 py-4">
                                                        {(projects.current_page - 1) * projects.per_page + index + 1}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-gray-900 text-base mb-1">{project.nama_proyek}</div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                            {project.lokasi}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="w-12 text-gray-400">Mulai:</span>
                                                            <span className="font-medium text-gray-700">{project.tanggal_mulai}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="w-12 text-gray-400">Selesai:</span>
                                                            <span className="font-medium text-red-600">{project.estimasi_penyelesaian}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-xs">
                                                            {project.work_items ? project.work_items.length : 0} Item
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <button 
                                                            onClick={() => openDetailModal(project)}
                                                            className="text-blue-600 hover:text-blue-800 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-4 py-2 rounded-md transition-colors font-medium text-xs w-full"
                                                        >
                                                            Lihat Detail
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                                    <p>Belum ada proyek yang ditugaskan kepada Anda.</p>
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
                                            ${link.active ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'} 
                                            ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Detail Proyek (Rincian Item Pekerjaan) */}
            {isModalOpen && selectedProject && (
                <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-black bg-opacity-60 transition-opacity p-4">
                    <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        
                        {/* Header Modal */}
                        <div className="bg-blue-600 p-5 shrink-0 relative">
                            <h3 className="text-xl font-bold text-white mb-1">{selectedProject.nama_proyek}</h3>
                            <p className="text-blue-100 text-sm">
                                {selectedProject.lokasi} | Timeline: {selectedProject.tanggal_mulai} s/d {selectedProject.estimasi_penyelesaian}
                            </p>
                            <button onClick={closeModal} className="absolute top-4 right-4 text-blue-200 hover:text-white transition-colors bg-blue-700 hover:bg-blue-800 p-1.5 rounded-full">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                        </div>
                        
                        {/* Body Modal (Scrollable) */}
                        <div className="p-6 overflow-y-auto grow bg-slate-50">
                            <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                                Rincian Item Pekerjaan
                            </h4>
                            
                            <div className="space-y-4">
                                {selectedProject.work_items && selectedProject.work_items.length > 0 ? (
                                    selectedProject.work_items.map((item, idx) => (
                                        <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-300 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                                                    {idx + 1}
                                                </div>
                                                <div>
                                                    <h5 className="font-bold text-gray-900 mb-1">{item.nama_item}</h5>
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {item.deskripsi || <span className="italic text-gray-400">Tidak ada deskripsi detail untuk item ini.</span>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10 bg-white border border-dashed border-gray-300 rounded-lg">
                                        <p className="text-gray-500 font-medium">Belum ada item pekerjaan untuk proyek ini.</p>
                                        <p className="text-sm text-gray-400 mt-1">Hubungi Administrator jika ini adalah sebuah kesalahan.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 border-t bg-gray-50 shrink-0 flex justify-end">
                            <button 
                                onClick={closeModal}
                                className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 px-5 py-2 rounded-md font-medium transition-colors shadow-sm"
                            >
                                Tutup
                            </button>
                        </div>
                        
                    </div>
                </div>
            )}
        </SiteManagerLayout>
    );
}