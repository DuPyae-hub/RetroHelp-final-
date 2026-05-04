<?php

use App\Support\RoleId;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('art_centers')) {
            Schema::table('art_centers', function (Blueprint $table) {
                if (! Schema::hasColumn('art_centers', 'nickname')) {
                    $table->string('nickname')->nullable()->unique()->after('name');
                }
                if (! Schema::hasColumn('art_centers', 'role_id')) {
                    $table->foreignId('role_id')->nullable()->after('nickname')->constrained('roles')->nullOnDelete();
                }
            });

            $rows = DB::table('art_centers')->select(['id', 'name'])->orderBy('id')->get();
            foreach ($rows as $row) {
                $slug = Str::slug((string) $row->name);
                if ($slug === '') {
                    $slug = 'center';
                }
                $nickname = $slug.'-'.$row->id;
                DB::table('art_centers')->where('id', $row->id)->update([
                    'nickname' => $nickname,
                    'role_id' => RoleId::ClinicStaff,
                ]);
            }
        }

        if (Schema::hasTable('users')) {
            Schema::table('users', function (Blueprint $table) {
                if (! Schema::hasColumn('users', 'art_center_id')) {
                    $table->foreignId('art_center_id')->nullable()->after('role_id')->constrained('art_centers')->nullOnDelete();
                }
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('users') && Schema::hasColumn('users', 'art_center_id')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropForeign(['art_center_id']);
                $table->dropColumn('art_center_id');
            });
        }

        if (Schema::hasTable('art_centers')) {
            Schema::table('art_centers', function (Blueprint $table) {
                if (Schema::hasColumn('art_centers', 'role_id')) {
                    $table->dropForeign(['role_id']);
                    $table->dropColumn('role_id');
                }
                if (Schema::hasColumn('art_centers', 'nickname')) {
                    $table->dropUnique(['nickname']);
                    $table->dropColumn('nickname');
                }
            });
        }
    }
};
