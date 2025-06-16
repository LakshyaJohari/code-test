// src/pages/dashboard/Dashboard.jsx
import React from 'react';
import InfoCard from './InfoCard.jsx';
export default function Dashboard({ stats, navigateTo }) {
  const infoCards = [
    { title: 'Total Subjects', value: stats.subjects, navigateTo: navigateTo, linkTo: 'Subjects', imageUrl: 'https://placehold.co/400x300/E9F5E9/34A853?text=Subjects' },
    { title: 'Total Students', value: stats.students, navigateTo: navigateTo, linkTo: 'Students', imageUrl: 'https://placehold.co/400x300/E8F0FE/4285F4?text=Students' },
    { title: 'Total Defaulters', value: stats.defaulters, navigateTo: navigateTo, linkTo: 'Defaulters', imageUrl: 'https://placehold.co/400x300/FCE8E6/EA4335?text=Defaulters' },
    { title: 'Total Faculty', value: stats.faculty, navigateTo: navigateTo, linkTo: 'Faculty', imageUrl: 'https://placehold.co/400x300/FEF7E0/FBBC05?text=Faculty' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {infoCards.map((card) => (
        <InfoCard key={card.title} {...card} />
      ))}
    </div>
  );
}
