<?php

use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\RestaurantController;
use Illuminate\Support\Facades\Route;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);
Route::get('/analytics/order-trends', [AnalyticsController::class, 'orderTrends']);
Route::get('/analytics/top-restaurants', [AnalyticsController::class, 'topRestaurants']);
Route::get('/analytics/filtered-orders', [AnalyticsController::class, 'filteredOrders']);