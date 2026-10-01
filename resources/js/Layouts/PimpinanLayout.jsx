import { useState, useRef, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function PimpinanLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showingProfileDropdown, setShowingProfileDropdown] = useState(false);
    
    const dropdownRef = useRef(null);

    // Menutup dropdown profil jika user mengklik area di luar dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowingProfileDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar Utama */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            {/* Logo */}
                            <div className="shrink-0 flex items-center">
                                <Link href="#">
                                    <span className="text-2xl font-bold text-blue-600">Resvara Pimpinan</span>
                                </Link>
                            </div>
 
                            {/* Menu Desktop */}
                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <Link
                                    href={route('pimpinan.dashboard')}
                                    className={route().current('pimpinan.dashboard') 
                                        ? "inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none transition duration-150 ease-in-out" 
                                        : "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out"}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('pimpinan.monitoring-proyek.index')}
                                    className={route().current('pimpinan.monitoring-proyek.index') 
                                        ? "inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none transition duration-150 ease-in-out" 
                                        : "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out"}
                                >
                                    Monitoring Proyek
                                </Link>
                                <Link
                                    href={route('pimpinan.cetak-laporan.index')}
                                    className={route().current('pimpinan.cetak-laporan.index') 
                                        ? "inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium leading-5 text-gray-900 focus:outline-none transition duration-150 ease-in-out" 
                                        : "inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out"}
                                >
                                    Laporan
                                </Link>
                                
                              
                            </div>
                        </div>

                        {/* Profil Dropdown & Logout (Desktop) */}
                        <div className="hidden sm:flex sm:items-center sm:ml-6">
                            <div className="ml-3 relative" ref={dropdownRef}>
                                <div>
                                    <button
                                        onClick={() => setShowingProfileDropdown(!showingProfileDropdown)}
                                        type="button"
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                    >
                                        <span className="mr-2">Halo, {user?.name || 'Pimpinan'}</span>
                                        {/* Ikon panah bawah */}
                                        <svg
                                            className="ml-2 -mr-0.5 h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                {/* Konten Dropdown Profil */}
                                {showingProfileDropdown && (
                                    <div className="absolute right-0 z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                        <div className="py-1">
                                            <div className="block px-4 py-2 text-xs text-gray-400 border-b border-gray-100">
                                                Manage Account
                                            </div>
                                            {/* Anda dapat menambahkan Link Profile di sini jika ada */}
                                            {/* <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link> */}
                                            
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:text-red-800 transition duration-150 ease-in-out"
                                            >
                                                Logout
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tombol Hamburger (Menu Mobile) */}
                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dropdown Menu Mobile */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <Link
                            href={route('pimpinan.dashboard')}
                            className={route().current('pimpinan.dashboard')
                                ? "block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50 focus:outline-none focus:text-blue-800 focus:bg-blue-100 focus:border-blue-700 transition duration-150 ease-in-out"
                                : "block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none transition duration-150 ease-in-out"}
                        >
                            Dashboard
                        </Link>
                        
                        
                    </div>

                    {/* Info Profil Mobile & Logout */}
                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user?.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user?.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:text-red-800 hover:bg-red-50 hover:border-red-300 focus:outline-none transition duration-150 ease-in-out"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Header Halaman (Opsional) */}
            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Konten Utama */}
            <main>{children}</main>
        </div>
    );
}