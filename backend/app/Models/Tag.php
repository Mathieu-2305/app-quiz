<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    protected $table = 'tags';

    protected $fillable = ['tag_name'];
    public $timestamps = true;

    public function quizzes()
    {
        return $this->belongsToMany(Quiz::class, 'quiz_tags', 'id_tag', 'id_quiz');
    }
}
