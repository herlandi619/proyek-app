<?php

namespace App\Http\Controllers\SiteManager;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class SiteManagerMyProjectController extends Controller
{
    public function index(Request $request)
    {
        // Hanya ambil proyek di mana site_manager_id = user yang sedang login
        $query = Project::with('workItems')
                        ->where('site_manager_id', Auth::id());

        // Fitur Pencarian
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama_proyek', 'like', "%{$search}%")
                  ->orWhere('lokasi', 'like', "%{$search}%");
            });
        }

        // Paginasi 5 per halaman
        $projects = $query->latest()->paginate(5)->withQueryString();

        return Inertia::render('SiteManager/MyProject/Index', [
            'projects' => $projects,
            'filters' => $request->only('search')
        ]);
    }
}