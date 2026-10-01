<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PimpinanMonitoringController extends Controller
{
    public function index(Request $request)
    {
        // Pimpinan dapat melihat seluruh proyek, ditarik beserta relasi lengkap
        $query = Project::with([
            'siteManager',
            'workItems.progressReports' => function($q) {
                // Urutkan laporan dari yang terbaru agar mudah diekstrak progres terakhirnya
                $q->orderBy('tanggal_laporan', 'desc');
            },
            'workItems.progressReports.progressPhotos',
            'workItems.progressReports.user'
        ]);

        // Pencarian (Berdasarkan nama proyek, lokasi, atau nama Site Manager)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%")
                  ->orWhereHas('siteManager', function($q2) use ($search) {
                      $q2->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Paginasi 5 per halaman
        $projects = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('Pimpinan/Monitoring/Index', [
            'projects' => $projects,
            'filters' => $request->only('search')
        ]);
    }
}