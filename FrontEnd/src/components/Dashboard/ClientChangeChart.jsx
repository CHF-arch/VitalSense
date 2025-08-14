import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTranslation } from "react-i18next";
const ClientChangeChart = ({ data }) => {
  const { t } = useTranslation();
  const chartData = [
    {
      name: t("dashboard.clients"),
      [t("dashboard.new_clients_this_month")]: data.newClientsThisMonth,
      [t("dashboard.new_clients_last_month")]: data.newClientsLastMonth,
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
        <Bar dataKey={t("dashboard.new_clients_this_month")} fill="#8884d8" />
        <Bar dataKey={t("dashboard.new_clients_last_month")} fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClientChangeChart;
