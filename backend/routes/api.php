<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
  return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->controller(UserController::class)->group(function () {
  Route::post('/create', 'register');
  Route::post('/signin', 'login');
  Route::middleware('auth:sanctum')->post('/logout', 'logout');
});