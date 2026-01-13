import React from 'react';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard = ({ title, children }: DashboardCardProps) => {
  return (
    <div className="dashboard-card">
      <h3 className="dashboard-card-title">{title}</h3>
      <div className="dashboard-card-content">
        {children}
      </div>
    </div>
  );
};

export default DashboardCard;