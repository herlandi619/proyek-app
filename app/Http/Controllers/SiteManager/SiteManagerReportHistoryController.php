<?php

namespace App\Http\Controllers\SiteManager;

use App\Http\Controllers\Controller;
use App\Models\ProgressReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SiteManagerReportHistoryController extends Controller
{
    public function index(Request $request)
    {
        // Tarik data laporan yang diinput oleh user (Site Manager) yang sedang login
        $query = ProgressReport::with(['workItem.project', 'progressPhotos'])
                               ->where('user_id', Auth::id());

        // Fitur Pencarian (Berdasarkan nama item, nama proyek, atau catatan)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('catatan', 'like', "%{$search}%")
                  ->orWhereHas('workItem', function ($q2) use ($search) {
                      $q2->where('nama_item', 'like', "%{$search}%")
                         ->orWhereHas('project', function ($q3) use ($search) {
                             $q3->where('nama_proyek', 'like', "%{$search}%");
                         });
                  });
            });
        }

        // Paginasi 5 per halaman
        $reports = $query->latest('tanggal_laporan')->paginate(5)->withQueryString();

        return Inertia::render('SiteManager/ReportHistory/Index', [
            'reports' => $reports,
            'filters' => $request->only('search')
        ]);
    }
}