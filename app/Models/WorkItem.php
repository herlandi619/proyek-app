<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkItem extends Model
{
    protected $guarded = [];

    public function project() {
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function progressReports() { 
        return $this->hasMany(ProgressReport::class, 'work_item_id'); 
    }
}
