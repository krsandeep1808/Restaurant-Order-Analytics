# Restaurant Order Analytics Dashboard

A full-stack analytics dashboard for restaurant order management with React frontend and PHP backend.

## Features

- **Restaurant Management**: View, search, and filter restaurants by cuisine, location, and rating
- **Order Analytics**: Track daily orders, revenue, average order value, and peak hours
- **Top Restaurants**: Identify top 3 restaurants by revenue for any date range
- **Advanced Filtering**: Filter orders by restaurant, date range, amount, and time
- **Star Ratings**: Visual rating system for restaurants with filtering capabilities
- **Responsive Design**: Clean, modern UI that works on desktop and mobile devices

## Tech Stack

### Frontend
- React 18.2.0
- Chart.js with react-chartjs-2 for data visualization
- Axios for API calls
- CSS3 with Flexbox/Grid layouts

### Backend
- Node.js with Express.js
- CORS enabled for cross-origin requests
- JSON-based mock data storage
- Custom API endpoints

## Project Structure

```
restaurant-analytics/
├── backend/
│   ├── storage/
│   │   └── app/
│   │       └── mock-data/
│   │           ├── restaurants.json
│   │           └── orders.json
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Dashboard.js
    │   │   ├── RestaurantList.js
    │   │   ├── Analytics.js
    │   │   ├── TopRestaurants.js
    │   │   ├── OrderFilter.js
    │   │   └── StarRating.js
    │   ├── services/
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    ├── public/
    │   └── index.html
    └── package.json
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Restaurants
- `GET /api/restaurants` - Get all restaurants with optional filtering
- `GET /api/restaurants/:id` - Get specific restaurant details

### Analytics
- `GET /api/analytics/order-trends` - Get order trends for a restaurant and date range
- `GET /api/analytics/top-restaurants` - Get top 3 restaurants by revenue
- `GET /api/analytics/filtered-orders` - Get filtered orders based on criteria

### Query Parameters

#### Restaurant Filters:
- `search` - Search by name or cuisine
- `cuisine` - Filter by cuisine type
- `location` - Filter by location
- `min_rating` - Filter by minimum rating (e.g., 4, 4.5)

#### Order Filters:
- `restaurant_id` - Filter by specific restaurant
- `start_date`, `end_date` - Date range filter
- `min_amount`, `max_amount` - Price range filter
- `start_hour`, `end_hour` - Time range filter (0-23)

## Mock Data

The application comes with sample data for 4 restaurants and 20+ orders:

### Restaurants:
1. **Tandoori Treats** - North Indian, Bangalore ⭐4.5
2. **Sushi Bay** - Japanese, Mumbai ⭐4.2
3. **Pasta Palace** - Italian, Delhi ⭐4.8
4. **Burger Hub** - American, Hyderabad ⭐4.0

### Orders:
Sample orders spanning multiple days with varying amounts and times to demonstrate analytics capabilities.

## Usage Guide

### Viewing Restaurants
1. The left sidebar displays all restaurants
2. Use search to find restaurants by name or cuisine
3. Filter by cuisine, location, or minimum rating
4. Click on a restaurant to view its analytics

### Analyzing Order Trends
1. Select a restaurant from the list
2. Choose a date range using the date pickers
3. View daily order counts, revenue, and peak hours in charts and tables

### Finding Top Restaurants
1. Set a date range using the date pickers
2. View the top 3 restaurants by revenue in the Top Restaurants section

### Filtering Orders
1. Use the Filter Orders section to apply various filters:
   - Restaurant ID
   - Amount range (min/max)
   - Time range (start/end hour)
2. Results update automatically as you change filters

## Customization

### Adding New Restaurants
Edit `backend/storage/app/mock-data/restaurants.json`:
```json
{
  "id": 105,
  "name": "New Restaurant",
  "location": "City",
  "cuisine": "Cuisine Type",
  "rating": 4.5
}
```

### Adding New Orders
Edit `backend/storage/app/mock-data/orders.json`:
```json
{
  "id": 21,
  "restaurant_id": 101,
  "order_date": "2024-01-07",
  "order_time": "14:30:00",
  "amount": 65.50
}
```

### Modifying Styling
- Main styles: `src/components/Dashboard.css`
- Component-specific styles: Each component has its own CSS file
- Color scheme can be modified in the CSS files

## Performance Features

- Client-side filtering for better responsiveness
- Efficient data processing for analytics
- Clean component architecture for maintainability
- Responsive design for mobile compatibility

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend is running on port 8000
2. **No Data Displayed**: Check if mock data files exist in the correct location
3. **API Connection Failed**: Verify both servers are running

### Debug Mode

Check browser console (F12) for:
- Network requests to API endpoints
- JavaScript errors
- CORS issues

## Future Enhancements

- Database integration (MySQL, PostgreSQL)
- User authentication
- Real-time order updates
- Export functionality for reports
- Advanced visualization options
- Mobile app version

---


**Note**: This is a demonstration project using mock data. For production use, integrate with a real database and add proper authentication/authorization.

