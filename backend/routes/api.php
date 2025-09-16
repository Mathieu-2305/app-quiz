<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuizController;

// Users
Route::get('/users', [UserController::class, 'index']);

// Quizzes
Route::get('/quizzes', [QuizController::class, 'index']);
Route::get('/quizzes/{id}', [QuizController::class, 'show']);

// Quiz creation
Route::post('/quizzes', [QuizController::class, 'store']);

Route::options('/{any}', function () {
  return response('', 204);
})->where('any', '.*');