import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import './OrderFilter.css';

const OrderFilter = ({ dateRange }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    restaurant_id: '',
    min_amount: '',
    max_amount: '',
    start_hour: '',
    end_hour: ''
  });

  useEffect(() => {
    loadOrders();
  }, [filters, dateRange]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const params = {
        ...filters,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      };
      
      const response = await analyticsAPI.getFilteredOrders(params);
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="order-filter">
      <h2>Filter Orders</h2>
      
      <div className="filter-controls">
        <div className="filter-group">
          <label>Restaurant ID:</label>
          <input
            type="text"
            name="restaurant_id"
            value={filters.restaurant_id}
            onChange={handleFilterChange}
            placeholder="e.g., 101"
          />
        </div>
        
        <div className="filter-group">
          <label>Min Amount:</label>
          <input
            type="number"
            name="min_amount"
            value={filters.min_amount}
            onChange={handleFilterChange}
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="filter-group">
          <label>Max Amount:</label>
          <input
            type="number"
            name="max_amount"
            value={filters.max_amount}
            onChange={handleFilterChange}
            placeholder="100"
            min="0"
          />
        </div>
        
        <div className="filter-group">
          <label>Start Hour (0-23):</label>
          <input
            type="number"
            name="start_hour"
            min="0"
            max="23"
            value={filters.start_hour}
            onChange={handleFilterChange}
            placeholder="0"
          />
        </div>
        
        <div className="filter-group">
          <label>End Hour (0-23):</label>
          <input
            type="number"
            name="end_hour"
            min="0"
            max="23"
            value={filters.end_hour}
            onChange={handleFilterChange}
            placeholder="23"
          />
        </div>
      </div>
      
      <button onClick={loadOrders} className="apply-filters-btn">
        Apply Filters
      </button>
      
      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>Order Date</th>
                <th>Order Time</th>
                <th>Restaurant</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.order_date}</td>
                  <td>{order.order_time}</td>
                  <td>{order.restaurant?.name || `Restaurant ${order.restaurant_id}`}</td>
                  <td>${order.amount.toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" style={{textAlign: 'center', padding: '20px'}}>
                    No orders found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderFilter;