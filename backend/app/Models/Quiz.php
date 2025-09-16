<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $table = 'quiz';
    protected $fillable = ['title','quiz_description','cover_image_url','is_active'];
    public $timestamps = true;

    public function questions() { return $this->hasMany(Question::class, 'id_quiz'); }
    public function tags()      { return $this->belongsToMany(Tag::class, 'quiz_tags', 'id_quiz', 'id_tag'); }
    public function modules()   { return $this->belongsToMany(Module::class, 'quiz_modules', 'id_quiz', 'id_module'); }
}

