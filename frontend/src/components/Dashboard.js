import React, { useState } from 'react';
import RestaurantList from './RestaurantList';
import Analytics from './Analytics';
import TopRestaurants from './TopRestaurants';
import OrderFilter from './OrderFilter';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  
  // Set default date range to last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  
  const [dateRange, setDateRange] = useState({
    startDate: sevenDaysAgo.toISOString().split('T')[0],
    endDate: today.toISOString().split('T')[0]
  });

  const handleDateChange = (field, value) => {
    setDateRange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Restaurant Order Analytics</h1>
      </header>
      
      <div className="dashboard-content">
        <div className="sidebar">
          <RestaurantList 
            onSelectRestaurant={setSelectedRestaurant} 
            selectedRestaurant={selectedRestaurant}
          />
        </div>
        
        <div className="main-content">
          <div className="date-range-picker">
            <h3>Date Range:</h3>
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Start Date: </label>
                <input 
                  type="date" 
                  value={dateRange.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>End Date: </label>
                <input 
                  type="date" 
                  value={dateRange.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {selectedRestaurant && (
            <Analytics 
              restaurantId={selectedRestaurant.id} 
              dateRange={dateRange}
            />
          )}
          
          <TopRestaurants dateRange={dateRange} />
          
          <OrderFilter dateRange={dateRange} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;