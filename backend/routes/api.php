<?php

use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BussinessController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use App\Http\Controllers\SaleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->controller(UserController::class)->group(function () {
    Route::post('/create', 'register');
    Route::post('/signin', 'login');
    Route::post('/email-verification', 'email');
    Route::post('/change-password', 'UpdatePassword');
    Route::middleware('auth:sanctum')->post('/logout', 'logout');
    Route::middleware('auth:sanctum')->post('/user-update/{id}', 'UserUpdate');
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
    Route::post('/archive', 'Archive');
    Route::post('/restore', 'restore');
});

Route::prefix('employee')->middleware('auth:sanctum')->controller(EmployeeController::class)->group(function () {
    Route::post('/create', 'insert');
    Route::post('/index', 'index');
    Route::post('/delete', 'delete');
    Route::post('/update', 'update');
    Route::post('/index', 'index');
    Route::post('/find', 'find');
    Route::post('fetchBusinesses', 'fetchBusinesses');
    Route::post('/archive', 'Archive');
    Route::post('/restore', 'restore');
});

Route::prefix('sale')->middleware('auth:sanctum')->controller(SaleController::class)->group(function () {
    Route::post('/create', 'insert');
    Route::post('/indexTeller', 'indexTeller');
});

Route::prefix('attendance')->middleware('auth:sanctum')->controller(AttendanceController::class)->group(function () {
    Route::post('/index', 'index');
});

Route::prefix('dashboard')->middleware("auth:sanctum")->controller(DashboardController::class)->group(function () {
    Route::post('/sales/{id}', 'sales');
    Route::post('/employee/{id}','employee');
    Route::post('/products/{id}','products');
    Route::post('/business/{id}','business');
    Route::post('/product-list/{id}', 'ProductList');
    Route::post('/product-out-of-stock/{id}', 'OutOfStock');
});
