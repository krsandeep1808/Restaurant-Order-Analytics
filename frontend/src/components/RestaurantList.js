import React, { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';
import StarRating from './StarRating';
import './RestaurantList.css';

const RestaurantList = ({ onSelectRestaurant, selectedRestaurant }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    location: '',
    minRating: ''
  });

  useEffect(() => {
    loadRestaurants();
  }, [searchTerm, filters]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (searchTerm) params.search = searchTerm;
      if (filters.cuisine) params.cuisine = filters.cuisine;
      if (filters.location) params.location = filters.location;
      if (filters.minRating) params.min_rating = filters.minRating;
      
      const response = await restaurantAPI.getRestaurants(params);
      setRestaurants(response.data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      setRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  const cuisines = [...new Set(restaurants.map(r => r.cuisine))];
  const locations = [...new Set(restaurants.map(r => r.location))];

  return (
    <div className="restaurant-list">
      <h2>Restaurants</h2>
      
      <div className="filters">
        <input
          type="text"
          placeholder="Search restaurants..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <select 
          value={filters.cuisine} 
          onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
        >
          <option value="">All Cuisines</option>
          {cuisines.map(cuisine => (
            <option key={cuisine} value={cuisine}>{cuisine}</option>
          ))}
        </select>
        
        <select 
          value={filters.location} 
          onChange={(e) => setFilters({...filters, location: e.target.value})}
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>

        <select 
          value={filters.minRating} 
          onChange={(e) => setFilters({...filters, minRating: e.target.value})}
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>
      </div>
      
      {loading ? (
        <p>Loading restaurants...</p>
      ) : (
        <ul>
          {restaurants.map(restaurant => (
            <li 
              key={restaurant.id} 
              className={selectedRestaurant?.id === restaurant.id ? 'selected' : ''}
              onClick={() => onSelectRestaurant(restaurant)}
            >
              <h3>{restaurant.name}</h3>
              <p>{restaurant.cuisine} • {restaurant.location}</p>
              <StarRating rating={restaurant.rating} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RestaurantList;