<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Restaurant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create restaurants from JSON
        $restaurantsJson = json_decode(file_get_contents(storage_path('app/mock-data/restaurants.json')), true);
        
        foreach ($restaurantsJson as $restaurantData) {
            Restaurant::create([
                'id' => $restaurantData['id'],
                'name' => $restaurantData['name'],
                'cuisine' => $restaurantData['cuisine'],
                'address' => $restaurantData['address'],
                'city' => $restaurantData['city'],
                'rating' => $restaurantData['rating'],
                'is_active' => true
            ]);
        }
        
        // Create orders from JSON
        $ordersJson = json_decode(file_get_contents(storage_path('app/mock-data/orders.json')), true);
        
        foreach ($ordersJson as $orderData) {
            $orderDate = Carbon::createFromFormat('Y-m-d', $orderData['order_date']);
            
            Order::create([
                'restaurant_id' => $orderData['restaurant_id'],
                'order_date' => $orderDate,
                'order_time' => $orderData['order_time'],
                'amount' => $orderData['amount'],
                'status' => 'completed'
            ]);
        }
    }
}