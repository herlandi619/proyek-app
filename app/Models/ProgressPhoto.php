<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressPhoto extends Model
{
    protected $guarded = [];

    public function progressReport() {
        return $this->belongsTo(ProgressReport::class);
    }
}
