'use client';
import React from 'react';
import NavBar from '../components/NavBar';
import HealthImprovementChart from '../components/HealthImprovementChart';
import CalendarCard from '../components/CalendarCard';
import LifestyleCard from '../components/LifestyleCard';
import HealthMetricsCard from '../components/HealthMetricsCard';
import BodyTrackingCard from '../components/BodyTrackingCard';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="bg-white p-4 rounded-b-3xl shadow-md">
        <NavBar />
      </div>
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <div className="md:col-span-3">
            <HealthImprovementChart />
          </div>
          <div className="md:col-span-2">
            <CalendarCard />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <LifestyleCard />
          </div>
          <div>
            <HealthMetricsCard />
          </div>
          <div>
            <BodyTrackingCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;