<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WorkItemSeeder extends Seeder
{
    public function run(): void
    {
        $workItems = [
            [
                'project_id' => 1,
                'nama_item' => 'Pekerjaan Persiapan & Pengukuran',
                'deskripsi' => 'Pembersihan lahan dan pengukuran bowplank.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'project_id' => 1,
                'nama_item' => 'Pekerjaan Pondasi',
                'deskripsi' => 'Penggalian dan pengecoran pondasi tapak.',
                'created_at' => now(),
                'updated_at' => now(),
            ] 
        ];

        DB::table('work_items')->insert($workItems);
    }
}