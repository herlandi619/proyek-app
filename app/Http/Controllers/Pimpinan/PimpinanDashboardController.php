<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\ProgressReport;
use App\Models\Project;
use App\Models\WorkItem;
use Illuminate\Http\Request;
use Inertia\Inertia; 

class PimpinanDashboardController extends Controller
{
    public function index(Request $request)
    {
        // Mengambil data proyek beserta relasinya untuk kalkulasi progres
        $query = Project::with(['siteManager', 'workItems.progressReports']);

        // Fitur Search
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        // Pagination 5
        $projects = $query->latest()->paginate(5)->withQueryString();

        // Ringkasan Eksekutif
        $totalProjects = Project::count();
        $totalWorkItems = WorkItem::count();
        
        // Menghitung rata-rata progres seluruh proyek yang ada laporannya (Sederhana)
        $totalReports = ProgressReport::count();
        $averageProgress = $totalReports > 0 ? ProgressReport::avg('persentase_progres') : 0;

        return Inertia::render('Pimpinan/Dashboard/Index', [
            'projects' => $projects,
            'summary' => [
                'total_projects' => $totalProjects,
                'total_work_items' => $totalWorkItems,
                'average_progress' => round($averageProgress, 2)
            ],
            'filters' => $request->only('search'),
            'flash' => [
                'message' => session('message'),
                'type' => session('type')
            ]
        ]);
    }
}