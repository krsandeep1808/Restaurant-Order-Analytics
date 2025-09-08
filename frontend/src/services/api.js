import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const restaurantAPI = {
  getRestaurants: (params) => api.get('/restaurants', { params }),
  getRestaurant: (id) => api.get(`/restaurants/${id}`),
};

export const analyticsAPI = {
  getOrderTrends: (params) => api.get('/analytics/order-trends', { params }),
  getTopRestaurants: (params) => api.get('/analytics/top-restaurants', { params }),
  getFilteredOrders: (params) => api.get('/analytics/filtered-orders', { params }),
};

export default api;