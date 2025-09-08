const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Load mock data
const restaurantsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'storage', 'app', 'mock-data', 'restaurants.json'), 'utf8'));
const ordersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'storage', 'app', 'mock-data', 'orders.json'), 'utf8'));

// Helper function to extract date from ISO timestamp
const getDateFromISO = (isoString) => {
  return isoString.split('T')[0];
};

// Helper function to extract time from ISO timestamp
const getTimeFromISO = (isoString) => {
  return isoString.split('T')[1].split('.')[0]; // Remove milliseconds if present
};

// Helper function to extract hour from ISO timestamp
const getHourFromISO = (isoString) => {
  return parseInt(isoString.split('T')[1].split(':')[0]);
};

// API Routes
app.get('/api/restaurants', (req, res) => {
  const { search, cuisine, location, min_rating } = req.query;
  
  // Debug logging
  console.log('API Request received with params:', {
    search,
    cuisine,
    location,
    min_rating
  });
  
  let filteredRestaurants = [...restaurantsData];

  // Apply filters
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(searchTerm) || 
      restaurant.cuisine.toLowerCase().includes(searchTerm)
    );
  }

  if (cuisine) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.cuisine === cuisine
    );
  }

  if (location) {
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.location === location
    );
  }

  if (min_rating) {
    const minRating = parseFloat(min_rating);
    filteredRestaurants = filteredRestaurants.filter(restaurant => 
      restaurant.rating >= minRating
    );
  }

  // Debug logging
  console.log('Filtered restaurants count:', filteredRestaurants.length);
  
  res.json(filteredRestaurants);
});

app.get('/api/restaurants/:id', (req, res) => {
  const restaurant = restaurantsData.find(r => r.id === parseInt(req.params.id));
  if (!restaurant) {
    return res.status(404).json({ error: 'Restaurant not found' });
  }
  res.json(restaurant);
});

app.get('/api/analytics/order-trends', (req, res) => {
  const { restaurant_id, start_date, end_date } = req.query;
  
  if (!restaurant_id || !start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Filter orders by restaurant and date range
  const filteredOrders = ordersData.filter(order => {
    const orderDate = getDateFromISO(order.order_time);
    return order.restaurant_id === parseInt(restaurant_id) &&
           orderDate >= start_date &&
           orderDate <= end_date;
  });

  // If no orders found, return empty array instead of error
  if (filteredOrders.length === 0) {
    return res.json([]);
  }

  // Group by date and calculate metrics
  const ordersByDate = {};
  filteredOrders.forEach(order => {
    const orderDate = getDateFromISO(order.order_time);
    if (!ordersByDate[orderDate]) {
      ordersByDate[orderDate] = {
        orders: [],
        totalAmount: 0
      };
    }
    ordersByDate[orderDate].orders.push(order);
    ordersByDate[orderDate].totalAmount += order.order_amount;
  });

  // Format response
  const result = Object.keys(ordersByDate).map(date => {
    const dailyData = ordersByDate[date];
    const ordersCount = dailyData.orders.length;
    const revenue = dailyData.totalAmount;
    const avgOrderValue = ordersCount > 0 ? revenue / ordersCount : 0;

    // Find peak hour
    const hours = {};
    dailyData.orders.forEach(order => {
      const hour = getHourFromISO(order.order_time);
      hours[hour] = (hours[hour] || 0) + 1;
    });

    let peakHour = '00';
    let maxOrders = 0;
    Object.keys(hours).forEach(hour => {
      if (hours[hour] > maxOrders) {
        maxOrders = hours[hour];
        peakHour = hour;
      }
    });

    return {
      date,
      orders_count: ordersCount,
      revenue: Math.round(revenue * 100) / 100,
      avg_order_value: Math.round(avgOrderValue * 100) / 100,
      peak_hour: peakHour
    };
  });

  res.json(result);
});

app.get('/api/analytics/top-restaurants', (req, res) => {
  const { start_date, end_date } = req.query;
  
  if (!start_date || !end_date) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  // Calculate revenue for each restaurant
  const restaurantRevenue = {};
  ordersData.forEach(order => {
    const orderDate = getDateFromISO(order.order_time);
    if (orderDate >= start_date && orderDate <= end_date) {
      if (!restaurantRevenue[order.restaurant_id]) {
        restaurantRevenue[order.restaurant_id] = 0;
      }
      restaurantRevenue[order.restaurant_id] += order.order_amount;
    }
  });

  // Map to restaurant objects and sort by revenue
  const topRestaurants = Object.keys(restaurantRevenue).map(restaurantId => {
    const restaurant = restaurantsData.find(r => r.id === parseInt(restaurantId));
    return {
      id: restaurant.id,
      name: restaurant.name,
      rating: restaurant.rating,
      revenue: Math.round(restaurantRevenue[restaurantId] * 100) / 100
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 3);

  res.json(topRestaurants);
});

app.get('/api/analytics/filtered-orders', (req, res) => {
  const { restaurant_id, start_date, end_date, min_amount, max_amount, start_hour, end_hour } = req.query;
  
  let filteredOrders = [...ordersData];

  // Apply filters
  if (restaurant_id) {
    filteredOrders = filteredOrders.filter(order => 
      order.restaurant_id === parseInt(restaurant_id)
    );
  }

  if (start_date) {
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = getDateFromISO(order.order_time);
      return orderDate >= start_date;
    });
  }

  if (end_date) {
    filteredOrders = filteredOrders.filter(order => {
      const orderDate = getDateFromISO(order.order_time);
      return orderDate <= end_date;
    });
  }

  if (min_amount) {
    filteredOrders = filteredOrders.filter(order => 
      order.order_amount >= parseFloat(min_amount)
    );
  }

  if (max_amount) {
    filteredOrders = filteredOrders.filter(order => 
      order.order_amount <= parseFloat(max_amount)
    );
  }

  if (start_hour) {
    filteredOrders = filteredOrders.filter(order => {
      const orderHour = getHourFromISO(order.order_time);
      return orderHour >= parseInt(start_hour);
    });
  }

  if (end_hour) {
    filteredOrders = filteredOrders.filter(order => {
      const orderHour = getHourFromISO(order.order_time);
      return orderHour <= parseInt(end_hour);
    });
  }

  // Add restaurant details to each order and format for frontend
  const ordersWithRestaurant = filteredOrders.map(order => {
    const restaurant = restaurantsData.find(r => r.id === order.restaurant_id);
    return {
      id: order.id,
      restaurant_id: order.restaurant_id,
      order_date: getDateFromISO(order.order_time),
      order_time: getTimeFromISO(order.order_time),
      amount: order.order_amount,
      restaurant: restaurant || { name: 'Unknown Restaurant' }
    };
  });

  res.json(ordersWithRestaurant);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});