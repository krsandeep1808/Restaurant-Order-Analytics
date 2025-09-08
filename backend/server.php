<?php
// Simple PHP server for API endpoints
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Simple router
$request_uri = $_SERVER['REQUEST_URI'];
$method = $_SERVER['REQUEST_METHOD'];

// API routes
if (strpos($request_uri, '/api/restaurants') !== false) {
    if ($method === 'GET') {
        // Return mock restaurants data
        $restaurants = json_decode(file_get_contents('storage/app/mock-data/restaurants.json'), true);
        echo json_encode($restaurants);
        exit;
    }
}

if (strpos($request_uri, '/api/analytics/order-trends') !== false) {
    if ($method === 'GET') {
        // Simple mock response for order trends
        $mockData = [
            ['date' => '2024-01-01', 'orders_count' => 15, 'revenue' => 450.50, 'avg_order_value' => 30.03, 'peak_hour' => '12'],
            ['date' => '2024-01-02', 'orders_count' => 18, 'revenue' => 520.75, 'avg_order_value' => 28.93, 'peak_hour' => '13'],
            ['date' => '2024-01-03', 'orders_count' => 12, 'revenue' => 380.25, 'avg_order_value' => 31.69, 'peak_hour' => '19'],
        ];
        echo json_encode($mockData);
        exit;
    }
}

if (strpos($request_uri, '/api/analytics/top-restaurants') !== false) {
    if ($method === 'GET') {
        // Simple mock response for top restaurants
        $mockData = [
            ['id' => 2, 'name' => 'Sushi Haven', 'revenue' => 1200.50],
            ['id' => 1, 'name' => 'Italian Bistro', 'revenue' => 980.75],
            ['id' => 4, 'name' => 'Taco Fiesta', 'revenue' => 850.25],
        ];
        echo json_encode($mockData);
        exit;
    }
}

if (strpos($request_uri, '/api/analytics/filtered-orders') !== false) {
    if ($method === 'GET') {
        // Return mock orders data
        $orders = json_decode(file_get_contents('storage/app/mock-data/orders.json'), true);
        echo json_encode($orders);
        exit;
    }
}

// Default response for unknown routes
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);