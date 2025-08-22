<?php

use App\Http\Controllers\BussinessController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->controller(UserController::class)->group(function () {
    Route::post('/create', 'register');
    Route::post('/signin', 'login');
    Route::middleware('auth:sanctum')->post('/logout', 'logout');
});

Route::prefix('business')->middleware('auth:sanctum')->controller(BussinessController::class)->group(function () {
    Route::post('/create', 'insert');
    Route::post('/index', 'index');
    Route::post('/delete', 'delete');
    Route::post('/update', 'update');
    Route::post('/index', 'index');
    Route::post('/find', 'find');
});

Route::prefix('product')->middleware('auth:sanctum')->controller(ProductController::class)->group(function () {
    Route::post('/create', 'insert');
    Route::post('/index', 'index');
    Route::post('/delete', 'delete');
    Route::post('/update', 'update');
    Route::post('/index', 'index');
    Route::post('/find', 'find');
    Route::post('fetchBusinesses', 'fetchBusinesses');
});

Route::prefix('employee')->middleware('auth:sanctum')->controller(EmployeeController::class)->group(function () {
    Route::post('/create', 'insert');
    Route::post('/index', 'index');
    Route::post('/delete', 'delete');
    Route::post('/update', 'update');
    Route::post('/index', 'index');
    Route::post('/find', 'find');
    Route::post('fetchBusinesses', 'fetchBusinesses');
});

Route::prefix('sale')->middleware('auth:sanctum')->controller(SaleController::class)->group(function () {
    Route::post('/create', 'insert');
    Route::post('/indexTeller', 'indexTeller');
});
