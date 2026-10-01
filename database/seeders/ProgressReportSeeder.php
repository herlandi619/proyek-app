<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgressReportSeeder extends Seeder
{
    public function run(): void
    {
        $reports = [
            [
                'work_item_id' => 1,
                'user_id' => 2, // Site Manager yang melaporkan
                'tanggal_laporan' => '2026-10-05',
                'persentase_progres' => 100.00,
                'catatan' => 'Pembersihan lahan selesai sesuai target.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'work_item_id' => 2,
                'user_id' => 2,
                'tanggal_laporan' => '2026-10-15',
                'persentase_progres' => 45.50,
                'catatan' => 'Proses penggalian selesai, bersiap untuk pengecoran.',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        DB::table('progress_reports')->insert($reports);
    }
}