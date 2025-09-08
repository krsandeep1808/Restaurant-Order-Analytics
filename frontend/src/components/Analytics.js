import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Analytics = ({ restaurantId, dateRange }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (restaurantId && dateRange.startDate && dateRange.endDate) {
      loadAnalytics();
    }
  }, [restaurantId, dateRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const params = {
        restaurant_id: restaurantId,
        start_date: dateRange.startDate,
        end_date: dateRange.endDate
      };
      
      const response = await analyticsAPI.getOrderTrends(params);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setAnalyticsData([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="analytics-loading">Loading analytics...</div>;
  if (!analyticsData.length) return <div className="analytics-empty">No data available for the selected date range.</div>;

  const ordersData = {
    labels: analyticsData.map(item => item.date),
    datasets: [
      {
        label: 'Daily Orders',
        data: analyticsData.map(item => item.orders_count),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: analyticsData.map(item => item.date),
    datasets: [
      {
        label: 'Daily Revenue',
        data: analyticsData.map(item => item.revenue),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="analytics">
      <h2>Order Trends</h2>
      
      <div className="charts-container">
        <div className="chart">
          <h3>Daily Orders Count</h3>
          <Bar data={ordersData} />
        </div>
        
        <div className="chart">
          <h3>Daily Revenue</h3>
          <Line data={revenueData} />
        </div>
      </div>
      
      <div className="analytics-table">
        <h3>Detailed Analytics</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Orders</th>
              <th>Revenue</th>
              <th>Avg Order Value</th>
              <th>Peak Hour</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map(item => (
              <tr key={item.date}>
                <td>{item.date}</td>
                <td>{item.orders_count}</td>
                <td>${item.revenue.toFixed(2)}</td>
                <td>${item.avg_order_value.toFixed(2)}</td>
                <td>{item.peak_hour}:00</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;