import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ClientChangeChart = ({ data }) => {
  const chartData = [
    {
      name: 'Clients',
      'New Clients This Month': data.newClientsThisMonth,
      'New Clients Last Month': data.newClientsLastMonth,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="New Clients This Month" fill="#8884d8" />
        <Bar dataKey="New Clients Last Month" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClientChangeChart;
