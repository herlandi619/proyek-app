<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::with('siteManager');

        // Fitur Search
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%"); 
        }

        // Pagination 5
        $projects = $query->latest()->paginate(5)->withQueryString();
        
        // Statistik Dashboard
        $totalProjects = Project::count();
        $totalUsers = User::count();
        
        // Data relasi untuk form modal (hanya ambil role Site Manager)
        $siteManagers = User::whereHas('role', function($q) {
            $q->where('name', 'site_manager');
        })->get();

        return Inertia::render('Admin/Dashboard/Index', [
            'projects' => $projects,
            'totalProjects' => $totalProjects,
            'totalUsers' => $totalUsers,
            'siteManagers' => $siteManagers,
            'filters' => $request->only('search'),
            'flash' => [
                'message' => session('message'),
                'type' => session('type')
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_proyek' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'estimasi_penyelesaian' => 'required|date|after_or_equal:tanggal_mulai',
            'site_manager_id' => 'required|exists:users,id',
        ]);

        Project::create($request->all());

        return redirect()->route('admin.dashboard')->with([
            'message' => 'Data Proyek berhasil ditambahkan!',
            'type' => 'success'
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $request->validate([
            'nama_proyek' => 'required|string|max:255',
            'lokasi' => 'required|string|max:255',
            'tanggal_mulai' => 'required|date',
            'estimasi_penyelesaian' => 'required|date|after_or_equal:tanggal_mulai',
            'site_manager_id' => 'required|exists:users,id',
        ]);

        $project->update($request->all());

        return redirect()->route('admin.dashboard')->with([
            'message' => 'Data Proyek berhasil diperbarui!',
            'type' => 'success'
        ]);
    }

    public function destroy(Project $project)
    {
        $project->delete();

        return redirect()->route('admin.dashboard')->with([
            'message' => 'Data Proyek berhasil dihapus!',
            'type' => 'success'
        ]);
    }
}