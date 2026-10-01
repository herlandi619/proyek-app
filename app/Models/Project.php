<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];

    public function siteManager() {
        return $this->belongsTo(User::class, 'site_manager_id');
    }

    public function workItems() {
        return $this->hasMany(WorkItem::class, 'project_id');
    }
}
