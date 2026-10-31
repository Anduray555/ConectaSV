<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserRole;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $password = env('ADMIN_PASSWORD');

        if (! $password) {
            $this->command->error('Define ADMIN_PASSWORD en tu .env antes de correr este seeder.');

            return;
        }

        $adminRole = UserRole::where('name', 'admin')->firstOrFail();

        User::updateOrCreate(
            ['email' => 'allananuto@gmail.com'],
            [
                'role_id' => $adminRole->id,
                'first_name' => 'Allan',
                'first_surname' => 'Anduray',
                'password' => $password,
                'is_active' => true,
            ],
        );
    }
}