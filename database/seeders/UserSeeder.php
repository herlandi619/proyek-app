<?php 

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'name' => 'Administrator',
                'email' => 'admin@resvara.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role_id' => 1, // Admin
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'sitemanager@resvara.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role_id' => 2, // Site Manager
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Direktur Utama',
                'email' => 'pimpinan@resvara.com',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
                'role_id' => 3, // Pimpinan
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('users')->insert($users);
    }
}