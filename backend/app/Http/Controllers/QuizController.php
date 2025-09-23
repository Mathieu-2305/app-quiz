<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\Answer;
use App\Models\Module;
use App\Models\Tag;

class QuizController extends Controller
{
    // GET /api/quizzes
    public function index()
    {
        $quizzes = Quiz::query()
            ->select(['id','title','quiz_description','is_active','cover_image_url','created_at','updated_at'])
            ->with([
                'tags:id,tag_name',
                'modules:id,module_name',
            ])
            ->get();

        return response()->json($quizzes);
    }

    // GET /api/quizzes/{id}
    public function show($id)
    {
        $quiz = Quiz::with([
            'tags:id,tag_name',
            'modules:id,module_name',
            'questions:id,id_quiz,id_type,question_titre,question_description,created_at,updated_at',
            'questions.type:id,type',
            'questions.answers:id,id_questions,answer_text,is_correct,created_at,updated_at',
        ])->findOrFail($id, [
            'id','title','quiz_description','is_active','cover_image_url','created_at','updated_at'
        ]);

        return response()->json($quiz);
    }

    // POST /api/quizzes
    public function store(Request $req)
    {
        $validated = $req->validate([
            'title'            => 'required|string|max:30',
            'quiz_description' => 'nullable|string|max:255',
            'cover_image_url'  => 'nullable|url',
            'cover_image'      => 'nullable|image|max:4096',
            'is_active'        => 'required|boolean',
            'questions'        => 'nullable', // JSON string or array

            'module_ids'       => 'array',
            'module_ids.*'     => 'integer|exists:modules,id',
            'tag_ids'          => 'array',
            'tag_ids.*'        => 'integer|exists:tags,id',
            'new_tags'         => 'array',
            'new_tags.*'       => 'string|min:1|max:50',
        ]);

        // Couverture: fichier > URL > null
        $coverUrl = null;
        if ($req->hasFile('cover_image')) {
            $path = $req->file('cover_image')->store('quiz-cards', 'public');
            $coverUrl = url(Storage::url($path));
        } elseif (!empty($validated['cover_image_url'])) {
            $coverUrl = $validated['cover_image_url'];
        }

        // Questions: string JSON | array | null
        $questions = $req->input('questions');
        if (is_string($questions)) {
            $questions = json_decode($questions, true) ?? [];
        } elseif (!is_array($questions)) {
            $questions = [];
        }

        DB::beginTransaction();
        try {
            // 1) Quiz
            $quiz = Quiz::create([
                'title'            => $validated['title'],
                'quiz_description' => $validated['quiz_description'] ?? '',
                'is_active'        => (bool) $validated['is_active'],
                'cover_image_url'  => $coverUrl,
            ]);

            // 2) Questions + réponses
            foreach ($questions as $q) {
                // Supporter nouvelles clés (front) ET anciennes (BD)
                $qTitle = $q['question_titre']       ?? $q['title']       ?? '';
                $qDesc  = $q['question_description'] ?? $q['description'] ?? null;

                // Type: 1=single, 2=multi par défaut si plusieurs bonnes réponses
                $idType = isset($q['id_type'])
                    ? (int) $q['id_type']
                    : ((count($q['correctIndices'] ?? []) > 1) ? 2 : 1);

                $question = Question::create([
                    'id_quiz'              => $quiz->id,
                    'id_type'              => $idType,
                    'question_titre'       => $qTitle,
                    'question_description' => $qDesc,
                ]);

                $opts    = $q['options'] ?? [];
                $correct = $q['correctIndices'] ?? [];
                foreach ($opts as $idx => $text) {
                    Answer::create([
                        'id_questions' => $question->id,
                        'answer_text'  => $text ?? '',
                        'is_correct'   => in_array($idx, $correct) ? 1 : 0,
                    ]);
                }
            }

            // 3) Modules
            $moduleIds = $validated['module_ids'] ?? [];
            if (!empty($moduleIds)) {
                $quiz->modules()->sync($moduleIds); 
            }

            // 4) Tags (existants + nouveaux)
            $tagIds = $validated['tag_ids'] ?? [];
            $createdTagIds = [];
            if (!empty($validated['new_tags'])) {
                foreach ($validated['new_tags'] as $name) {
                    $name = trim($name);
                    if ($name === '') continue;
                    $tag = Tag::firstOrCreate(['tag_name' => $name]);
                    $createdTagIds[] = $tag->id;
                }
            }
            if (!empty($tagIds) || !empty($createdTagIds)) {
                $quiz->tags()->sync(array_merge($tagIds, $createdTagIds));
            }

            DB::commit();

            // 5) Retour enrichi
            $fresh = Quiz::select('id','title','quiz_description','cover_image_url','is_active','created_at','updated_at')
                ->with(['modules:id,module_name','tags:id,tag_name'])
                ->find($quiz->id);

            return response()->json($fresh, 201);

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error while creating the quiz', 'error' => $e->getMessage()], 500);
        }
    }
}
