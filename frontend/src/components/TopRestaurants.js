import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import StarRating from './StarRating';
import './TopRestaurants.css';

const TopRestaurants = ({ dateRange }) => {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dateRange.startDate && dateRange.endDate) {
      loadTopRestaurants();
    }
  }, [dateRange]);

  const loadTopRestaurants = async () => {
    try {
      setLoading(true);
      const params = {
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      };
      
      const response = await analyticsAPI.getTopRestaurants(params);
      setTopRestaurants(response.data);
    } catch (error) {
      console.error('Error loading top restaurants:', error);
      setTopRestaurants([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="top-restaurants-loading">Loading top restaurants...</div>;

  return (
    <div className="top-restaurants">
      <h2>Top 3 Restaurants by Revenue</h2>
      
      {topRestaurants.length > 0 ? (
        <div className="restaurants-list">
          {topRestaurants.map((restaurant, index) => (
            <div key={restaurant.id} className="restaurant-item">
              <div className="rank">#{index + 1}</div>
              <div className="details">
                <h3>{restaurant.name}</h3>
                <StarRating rating={restaurant.rating} />
                <p className="revenue">${restaurant.revenue.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No data available for the selected date range.</p>
      )}
    </div>
  );
};

export default TopRestaurants;