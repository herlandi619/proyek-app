<?php

namespace App\Http\Controllers\SiteManager;

use App\Http\Controllers\Controller;
use App\Models\ProgressReport;
use App\Models\ProgressPhoto;
use App\Models\WorkItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
 
class SiteManagerProgressReportController extends Controller
{
    public function index(Request $request)
    {
        $userId = Auth::id();

        // Ambil riwayat laporan milik Site Manager ini
        $query = ProgressReport::with(['workItem.project', 'progressPhotos'])
                               ->where('user_id', $userId);

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->whereHas('workItem', function ($q) use ($search) {
                $q->where('nama_item', 'like', "%{$search}%")
                  ->orWhereHas('project', function ($q2) use ($search) {
                      $q2->where('nama_proyek', 'like', "%{$search}%");
                  });
            });
        }

        $reports = $query->latest()->paginate(5)->withQueryString();

        // Ambil daftar Work Items khusus pada proyek yang di-manage oleh Site Manager ini
        $workItems = WorkItem::with('project')
            ->whereHas('project', function ($q) use ($userId) {
                $q->where('site_manager_id', $userId);
            })->get();

        return Inertia::render('SiteManager/ProgressReport/Index', [
            'reports' => $reports,
            'workItems' => $workItems,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'work_item_id' => 'required|exists:work_items,id',
            'tanggal_laporan' => 'required|date',
            'persentase_progres' => 'required|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|array',
            'foto.*' => 'image|mimes:jpeg,png,jpg|max:5120' // Max 5MB per foto
        ]);

        $report = ProgressReport::create([
            'work_item_id' => $request->work_item_id,
            'user_id' => Auth::id(),
            'tanggal_laporan' => $request->tanggal_laporan,
            'persentase_progres' => $request->persentase_progres,
            'catatan' => $request->catatan,
        ]);

        // Handle multi-upload foto
        if ($request->hasFile('foto')) {
            foreach ($request->file('foto') as $file) {
                $path = $file->store('progress_photos', 'public');
                ProgressPhoto::create([
                    'progress_report_id' => $report->id,
                    'path_foto' => $path
                ]);
            }
        }

        return back()->with('message', 'Laporan progres berhasil disimpan!');
    }

    public function update(Request $request, ProgressReport $progressReport)
    {
        $request->validate([
            'work_item_id' => 'required|exists:work_items,id',
            'tanggal_laporan' => 'required|date',
            'persentase_progres' => 'required|numeric|min:0|max:100',
            'catatan' => 'nullable|string',
            'foto' => 'nullable|array',
            'foto.*' => 'image|mimes:jpeg,png,jpg|max:5120'
        ]);

        $progressReport->update([
            'work_item_id' => $request->work_item_id,
            'tanggal_laporan' => $request->tanggal_laporan,
            'persentase_progres' => $request->persentase_progres,
            'catatan' => $request->catatan,
        ]);

        // Tambah foto baru jika ada upload di mode edit
        if ($request->hasFile('foto')) {
            foreach ($request->file('foto') as $file) {
                $path = $file->store('progress_photos', 'public');
                ProgressPhoto::create([
                    'progress_report_id' => $progressReport->id,
                    'path_foto' => $path
                ]);
            }
        }

        return back()->with('message', 'Laporan progres berhasil diperbarui!');
    }

    public function destroy(ProgressReport $progressReport)
    {
        // Hapus file fisik foto sebelum menghapus record dari DB (opsional tapi disarankan)
        foreach ($progressReport->progressPhotos as $photo) {
            Storage::disk('public')->delete($photo->path_foto);
        }
        
        $progressReport->delete();

        return back()->with('message', 'Laporan progres dan foto berhasil dihapus!');
    }
}