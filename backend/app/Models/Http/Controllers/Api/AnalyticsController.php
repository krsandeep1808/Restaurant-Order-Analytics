<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class AnalyticsController extends Controller
{
    public function orderTrends(Request $request)
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);
        
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        
        $orders = Order::where('restaurant_id', $request->restaurant_id)
            ->whereBetween('order_date', [$startDate, $endDate])
            ->get();
        
        // Group by date
        $groupedByDate = $orders->groupBy(function($order) {
            return $order->order_date->format('Y-m-d');
        });
        
        $dailyData = [];
        foreach ($groupedByDate as $date => $dateOrders) {
            $dailyOrdersCount = $dateOrders->count();
            $dailyRevenue = $dateOrders->sum('amount');
            $avgOrderValue = $dailyOrdersCount > 0 ? $dailyRevenue / $dailyOrdersCount : 0;
            
            // Find peak hour
            $hourlyOrders = $dateOrders->groupBy(function($order) {
                return Carbon::parse($order->order_time)->format('H');
            });
            
            $peakHour = $hourlyOrders->sortByDesc(function($hourOrders) {
                return $hourOrders->count();
            })->keys()->first();
            
            $dailyData[] = [
                'date' => $date,
                'orders_count' => $dailyOrdersCount,
                'revenue' => round($dailyRevenue, 2),
                'avg_order_value' => round($avgOrderValue, 2),
                'peak_hour' => $peakHour
            ];
        }
        
        return $dailyData;
    }
    
    public function topRestaurants(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date'
        ]);
        
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        
        $restaurants = Restaurant::all();
        $restaurantRevenues = [];
        
        foreach ($restaurants as $restaurant) {
            $revenue = Order::where('restaurant_id', $restaurant->id)
                ->whereBetween('order_date', [$startDate, $endDate])
                ->sum('amount');
            
            $restaurantRevenues[] = [
                'id' => $restaurant->id,
                'name' => $restaurant->name,
                'revenue' => round($revenue, 2)
            ];
        }
        
        // Sort by revenue descending and take top 3
        usort($restaurantRevenues, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });
        
        return array_slice($restaurantRevenues, 0, 3);
    }
    
    public function filteredOrders(Request $request)
    {
        $query = Order::with('restaurant');
        
        // Restaurant filter
        if ($request->has('restaurant_id') && !empty($request->restaurant_id)) {
            $query->where('restaurant_id', $request->restaurant_id);
        }
        
        // Date range filter
        if ($request->has('start_date') && !empty($request->start_date)) {
            $startDate = Carbon::parse($request->start_date);
            $query->where('order_date', '>=', $startDate);
        }
        
        if ($request->has('end_date') && !empty($request->end_date)) {
            $endDate = Carbon::parse($request->end_date);
            $query->where('order_date', '<=', $endDate);
        }
        
        // Amount range filter
        if ($request->has('min_amount') && !empty($request->min_amount)) {
            $query->where('amount', '>=', $request->min_amount);
        }
        
        if ($request->has('max_amount') && !empty($request->max_amount)) {
            $query->where('amount', '<=', $request->max_amount);
        }
        
        // Hour range filter
        if ($request->has('start_hour') && !empty($request->start_hour)) {
            $query->whereTime('order_time', '>=', $request->start_hour . ':00:00');
        }
        
        if ($request->has('end_hour') && !empty($request->end_hour)) {
            $query->whereTime('order_time', '<=', $request->end_hour . ':59:59');
        }
        
        return $query->orderBy('order_date', 'desc')
                    ->orderBy('order_time', 'desc')
                    ->get();
    }
}