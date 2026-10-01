<?php

namespace App\Http\Controllers\SiteManager;

use App\Http\Controllers\Controller;
use App\Models\ProgressReport;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SiteManagerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = auth()->id();

        // Mengambil data proyek khusus untuk Site Manager yang sedang login
        $query = Project::where('site_manager_id', $userId);

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

        // Statistik Dashboard
        $totalProyekSaya = Project::where('site_manager_id', $userId)->count();
        $totalLaporanSaya = ProgressReport::where('user_id', $userId)->count();

        // Data untuk Grafik/Visualisasi Progres (Contoh sederhana mengambil data proyek)
        // Di aplikasi nyata, Anda bisa menghitung rata-rata persentase_progres dari relasi work_items
        $projectStats = Project::where('site_manager_id', $userId)
            ->select('id', 'nama_proyek', 'estimasi_penyelesaian')
            ->take(5)
            ->get();

        return Inertia::render('SiteManager/Dashboard/Index', [
            'projects' => $projects,
            'totalProyekSaya' => $totalProyekSaya,
            'totalLaporanSaya' => $totalLaporanSaya,
            'projectStats' => $projectStats,
            'filters' => $request->only('search'),
            'flash' => [
                'message' => session('message'),
                'type' => session('type')
            ]
        ]);
    }
}