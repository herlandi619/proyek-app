<?php 

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\WorkItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminWorkItemController extends Controller
{
    public function index(Request $request)
    {
        $query = WorkItem::with('project');

        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('nama_item', 'like', "%{$search}%")
                  ->orWhereHas('project', function ($q) use ($search) {
                      $q->where('nama_proyek', 'like', "%{$search}%");
                  });
        }

        $workItems = $query->latest()->paginate(5)->withQueryString();
        
        $projects = Project::select('id', 'nama_proyek')->orderBy('nama_proyek')->get();

        return Inertia::render('Admin/WorkItem/Index', [
            'workItems' => $workItems,
            'projects' => $projects,
            'filters' => $request->only('search')
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'nama_item' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        WorkItem::create($validated);

        return back()->with('message', 'Item pekerjaan berhasil ditambahkan!');
    }

    public function update(Request $request, WorkItem $workItem)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'nama_item' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
        ]);

        $workItem->update($validated);

        return back()->with('message', 'Item pekerjaan berhasil diperbarui!');
    }

    public function destroy(WorkItem $workItem)
    {
        $workItem->delete();

        return back()->with('message', 'Item pekerjaan berhasil dihapus!');
    }
}