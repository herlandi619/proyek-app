<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminMonitoringController;
use App\Http\Controllers\Admin\AdminProjectController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminWorkItemController;
use App\Http\Controllers\Pimpinan\PimpinanDashboardController;
use App\Http\Controllers\Pimpinan\PimpinanMonitoringController;
use App\Http\Controllers\Pimpinan\PimpinanReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SiteManager\SiteManagerDashboardController;
use App\Http\Controllers\SiteManager\SiteManagerMyProjectController;
use App\Http\Controllers\SiteManager\SiteManagerProgressReportController;
use App\Http\Controllers\SiteManager\SiteManagerReportHistoryController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ADMIN
Route::middleware(['auth'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
 
        // 1 Dashboard 
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
        // Route::post('/dashboard/projects', [AdminDashboardController::class, 'store'])->name('projectss.store');
        // Route::put('/dashboard/projects/{project}', [AdminDashboardController::class, 'update'])->name('projectss.update');
        // Route::delete('/dashboard/projects/{project}', [AdminDashboardController::class, 'destroy'])->name('projectss.destroy');
        
        // 2.Route Manajemen Pengguna
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

            // 3.Manajemen Proyek
        Route::get('/projects', [AdminProjectController::class, 'index'])->name('projects.index');
        Route::post('/projects', [AdminProjectController::class, 'store'])->name('projects.store');
        Route::put('/projects/{project}', [AdminProjectController::class, 'update'])->name('projects.update');
        Route::delete('/projects/{project}', [AdminProjectController::class, 'destroy'])->name('projects.destroy');
        
        // 4.Manajemen Item Pekerjaan
        Route::get('/work-items', [AdminWorkItemController::class, 'index'])->name('work-items.index');
        Route::post('/work-items', [AdminWorkItemController::class, 'store'])->name('work-items.store');
        Route::put('/work-items/{workItem}', [AdminWorkItemController::class, 'update'])->name('work-items.update');
        Route::delete('/work-items/{workItem}', [AdminWorkItemController::class, 'destroy'])->name('work-items.destroy');



        // 5. Monitoring & Laporan (View Only)
        Route::get('/monitoring', [AdminMonitoringController::class, 'index'])->name('monitoring.index');

        
});

// Site Manager
Route::middleware(['auth'])
    ->prefix('site-manager')
    ->name('site-manager.')
    ->group(function () {

    // 1. DASHBOARD URI: /site-manager/dashboard | Name: site-manager.dashboard
        Route::get('/dashboard', [SiteManagerDashboardController::class, 'index'])->name('dashboard');
        
        // 2. Proyek Saya
        Route::get('/my-projects', [SiteManagerMyProjectController::class, 'index'])->name('my-projects.index');   

        // 3. Input Progres Pekerjaan
        Route::get('/progress-reports', [SiteManagerProgressReportController::class, 'index'])->name('progress-reports.index');
        Route::post('/progress-reports', [SiteManagerProgressReportController::class, 'store'])->name('progress-reports.store');
        Route::put('/progress-reports/{progressReport}', [SiteManagerProgressReportController::class, 'update'])->name('progress-reports.update'); // Gunakan POST untuk form-data
        Route::delete('/progress-reports/{progressReport}', [SiteManagerProgressReportController::class, 'destroy'])->name('progress-reports.destroy');

        // 4. Riwayat Laporan Progres
        Route::get('/report-history', [SiteManagerReportHistoryController::class, 'index'])->name('report-history.index');

});

//  Pimpinan
Route::middleware(['auth'])
    ->prefix('pimpinan')
    ->name('pimpinan.')
    ->group(function () {

        // 1. DASHBOARD URI: /pimpinan/dashboard | Name: pimpinan.dashboard
        Route::get('/dashboard', [PimpinanDashboardController::class, 'index'])->name('dashboard'); 

        // 2. Data Proyek Real-Time
        Route::get('/monitoring-proyek', [PimpinanMonitoringController::class, 'index'])->name('monitoring-proyek.index');

        // 3. Menu Cetak Laporan
        Route::get('/cetak-laporan', [PimpinanReportController::class, 'index'])->name('cetak-laporan.index');
        Route::get('/cetak-laporan/pdf', [PimpinanReportController::class, 'exportPdf'])->name('cetak-laporan.pdf');
});

require __DIR__.'/auth.php';
