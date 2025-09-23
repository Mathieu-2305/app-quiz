<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\ModuleController;

// Users
Route::get('/users', [UserController::class, 'index']);

// Quizzes
Route::get('/quizzes', [QuizController::class, 'index']);
Route::get('/quizzes/{id}', [QuizController::class, 'show']);

// Quiz creation
Route::post('/quizzes', [QuizController::class, 'store']);

// Modules creation and fetch
Route::get('/modules', [ModuleController::class, 'index']);
Route::post('/modules', [ModuleController::class, 'store']);

// Tags creation and fetch
Route::get('/tags', [TagController::class, 'index']);
Route::post('/tags', [TagController::class, 'store']);

Route::options('/{any}', function () {
  return response('', 204);
})->where('any', '.*');