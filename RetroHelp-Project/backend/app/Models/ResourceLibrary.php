<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResourceLibrary extends Model
{
    protected $table = 'resource_libraries';

    protected $fillable = [
        'title',
        'content',
        'ebook_url',
        'category',
    ];
}
