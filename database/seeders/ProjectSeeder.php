<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('projects')->insert([
            'nama_proyek' => 'Pembangunan Gedung Perkantoran Baru',
            'lokasi' => 'Jl. Sudirman, Jakarta Pusat',
            'tanggal_mulai' => '2026-10-01',
            'estimasi_penyelesaian' => '2027-08-31',
            'site_manager_id' => 2, // Mengacu pada Budi Santoso
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}