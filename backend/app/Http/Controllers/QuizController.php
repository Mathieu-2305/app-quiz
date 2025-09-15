<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Quiz;

class QuizController extends Controller
{
    // GET /api/quizzes
    public function index()
    {
        $quizzes = Quiz::with(['tags:id,tag_name'])
            ->get(['id','title','quiz_description','created_at','updated_at']);

        return response()->json($quizzes);
    }

    // GET /api/quizzes/{id}
     public function show($id)
    {
        $quiz = Quiz::with([
            'tags:id,tag_name',
            'questions:id,id_quiz,id_type,created_at,updated_at',
            'questions.type:id,type',
            'questions.answers:id,id_questions,is_correct,created_at,updated_at',
        ])->findOrFail($id, ['id','title','quiz_description','created_at','updated_at']);

        return response()->json($quiz);
    }
}
