<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProgressReport extends Model
{
    protected $guarded = [];

    public function workItem() { 
        return $this->belongsTo(WorkItem::class, 'work_item_id'); 
    }

    public function user() { 
        return $this->belongsTo(User::class, 'user_id'); 
    }

    public function progressPhotos() { 
        return $this->hasMany(ProgressPhoto::class, 'progress_report_id'); 
    }
    
}
