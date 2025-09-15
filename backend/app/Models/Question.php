<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $table = 'questions';
    public $timestamps = true;

    public function quiz() { return $this->belongsTo(Quiz::class, 'id_quiz'); }
    public function type() { return $this->belongsTo(TypeQuestion::class, 'id_type'); }
    public function answers() { return $this->hasMany(Answer::class, 'id_questions'); }
}

