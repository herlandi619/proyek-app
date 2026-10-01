<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProgressPhotoSeeder extends Seeder
{
    public function run(): void
    {
        $photos = [
            [
                'progress_report_id' => 1,
                'path_foto' => 'uploads/progres/lahan_bersih.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'progress_report_id' => 2,
                'path_foto' => 'uploads/progres/galian_pondasi.jpg',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ];

        DB::table('progress_photos')->insert($photos);
    }
}