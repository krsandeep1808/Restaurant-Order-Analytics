<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    public function index(Request $request)
    {
        $query = Restaurant::query();
        
        // Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('cuisine', 'like', "%{$search}%");
        }
        
        // Filter by cuisine
        if ($request->has('cuisine') && !empty($request->cuisine)) {
            $query->where('cuisine', $request->cuisine);
        }
        
        // Filter by city
        if ($request->has('city') && !empty($request->city)) {
            $query->where('city', $request->city);
        }
        
        // Filter by rating
        if ($request->has('min_rating') && !empty($request->min_rating)) {
            $query->where('rating', '>=', $request->min_rating);
        }
        
        // Sorting
        $sortField = $request->get('sort_by', 'name');
        $sortOrder = $request->get('sort_order', 'asc');
        $query->orderBy($sortField, $sortOrder);
        
        return $query->get();
    }
    
    public function show($id)
    {
        return Restaurant::findOrFail($id);
    }
}