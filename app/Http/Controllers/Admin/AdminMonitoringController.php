<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMonitoringController extends Controller
{
    public function index(Request $request)
    {
        // Tarik data proyek beserta seluruh relasi nested-nya
        $query = Project::with([
            'siteManager',
            'workItems.progressReports.user', 
            'workItems.progressReports.progressPhotos'
        ]);

        // Fitur Pencarian berdasarkan nama proyek atau lokasi
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
        }

        // Paginasi 5 data per halaman
        $projects = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('Admin/Monitoring/Index', [
            'projects' => $projects,
            'filters' => $request->only('search')
        ]);
    }
}