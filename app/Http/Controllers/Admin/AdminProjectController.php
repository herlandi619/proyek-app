<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('siteManager');

        // Fitur Pencarian
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
        }

        // Paginasi 5 per halaman
        $projects = $query->latest()->paginate(5)->withQueryString();
        
        // Mengambil data user khusus untuk role 'site_manager'
        $siteManagers = User::whereHas('role', function ($query) {
            $query->where('name', 'site_manager');
        })->select('id', 'name')->get();

        return Inertia::render('Admin/Project/Index', [
            'projects' => $projects,
            'siteManagers' => $siteManagers,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_proyek' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'estimasi_penyelesaian' => 'required|date|after_or_equal:tanggal_mulai',
            'site_manager_id' => 'required|exists:users,id',
        ]);

        Project::create($validated);

        // Menggunakan back() agar Inertia me-reload data di halaman saat ini
        return back()->with('message', 'Proyek berhasil ditambahkan!');
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'nama_proyek' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'estimasi_penyelesaian' => 'required|date|after_or_equal:tanggal_mulai',
            'site_manager_id' => 'required|exists:users,id',
        ]);

        $project->update($validated);

        // Menggunakan back() agar Inertia me-reload data di halaman saat ini
        return back()->with('message', 'Proyek berhasil diperbarui!');
    }

    public function destroy(Project $project)
    {
        $project->delete();

        // Menggunakan back() agar Inertia me-reload data di halaman saat ini
        return back()->with('message', 'Proyek berhasil dihapus!');
    }
}