import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function InfoCard({ title, value, navigate, linkTo, IconComponent }) {
  const bgColorClass = {
    'Total Subjects': 'bg-green-100 text-green-700',
    'Total Students': 'bg-blue-100 text-blue-700',
    'Total Defaulters': 'bg-red-100 text-red-700',
    'Total Faculty': 'bg-yellow-100 text-yellow-700',
    'Departments': 'bg-purple-100 text-purple-700',
    'Settings': 'bg-gray-100 text-gray-700',
  }[title] || 'bg-gray-100 text-gray-700';

  const hoverBgClass = {
    'Total Subjects': 'hover:bg-green-200',
    'Total Students': 'hover:bg-blue-200',
    'Total Defaulters': 'hover:bg-red-200',
    'Total Faculty': 'hover:hover:bg-yellow-200',
    'Departments': 'hover:bg-purple-200',
    'Settings': 'hover:bg-gray-200',
  }[title] || 'hover:bg-gray-200';

  const handleCardClick = () => {
    if (linkTo && navigate) {
      navigate(linkTo);
    }
  };

  return (
    <div
      className={`p-6 rounded-lg shadow-md flex flex-col justify-between ${bgColorClass} ${hoverBgClass} transition-colors duration-200 cursor-pointer`}
      onClick={handleCardClick}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {IconComponent && React.createElement(IconComponent, { size: 28, className: "text-current" })}
      </div>
      <p className="text-4xl font-bold mb-4">{value}</p>
      <button 
        onClick={handleCardClick}
        className="w-full flex items-center justify-between px-4 py-2 bg-white bg-opacity-70 rounded-lg text-sm font-medium hover:bg-opacity-100 transition-colors duration-200"
      >
        View All
        <ChevronRight size={18} />
      </button>
    </div>
  );
}