<?php

namespace App\Http\Controllers\Pimpinan;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\ProgressReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf; // Pastikan library ini sudah terinstal

class PimpinanReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('siteManager');

        // Pencarian Tabel (Hanya untuk display di layar UI Pimpinan)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
        }

        // Paginasi 5 per halaman
        $projects = $query->latest()->paginate(5)->withQueryString();

        // Data semua proyek tanpa paginasi untuk Dropdown di Modal Filter
        $allProjects = Project::select('id', 'nama_proyek')->orderBy('nama_proyek')->get();

        return Inertia::render('Pimpinan/Report/Index', [
            'projects' => $projects,
            'allProjects' => $allProjects,
            'filters' => $request->only('search')
        ]);
    }

    public function exportPdf(Request $request)
    {
        // Menangkap parameter filter
        $projectId = $request->project_id;
        $startDate = $request->start_date;
        $endDate = $request->end_date;

        // Tarik data Laporan Progres berserta relasi lengkap
        $query = ProgressReport::with(['workItem.project', 'user', 'progressPhotos']);

        // Filter berdasarkan Proyek Tertentu (jika dipilih)
        if ($projectId) {
            $query->whereHas('workItem', function ($q) use ($projectId) {
                $q->where('project_id', $projectId);
            });
        }

        // Filter berdasarkan Rentang Tanggal
        if ($startDate && $endDate) {
            $query->whereBetween('tanggal_laporan', [$startDate, $endDate]);
        } elseif ($startDate) {
            $query->where('tanggal_laporan', '>=', $startDate);
        } elseif ($endDate) {
            $query->where('tanggal_laporan', '<=', $endDate);
        }

        $reports = $query->orderBy('tanggal_laporan', 'asc')->get();

        // Ambil info nama proyek untuk judul (jika filter per proyek aktif)
        $projectName = $projectId ? Project::find($projectId)->nama_proyek : 'Semua Proyek';

        // --- PROSES GENERATE PDF ---
        // Jika Anda belum membuat file blade-nya, Anda perlu membuat file resources/views/pdf/laporan-progres.blade.php
        $pdf = Pdf::loadView('pdf.laporan-progres', [
            'reports' => $reports,
            'projectName' => $projectName,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'tanggalCetak' => now()->format('d/m/Y H:i')
        ]);

        // Mengatur format kertas (opsional)
        $pdf->setPaper('A4', 'landscape');

        // Download file PDF
        return $pdf->download('Laporan_Progres_' . date('Ymd_His') . '.pdf');
    }
}