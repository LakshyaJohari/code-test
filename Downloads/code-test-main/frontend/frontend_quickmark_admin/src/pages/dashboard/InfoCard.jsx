// // src/components/dashboard/InfoCard.jsx
// import React from 'react';

// export default function InfoCard({ title, value, navigateTo, linkTo, imageUrl }) {
//     return (
//         // The main card container
//         <div className="w-45 bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
//             {/* The image is now shorter (h-40 instead of h-48) */}
//             <img 
//               src={imageUrl} 
//               alt={title} 
//               className="w-full h-40 object-cover"
//               onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/cccccc/ffffff?text=Image+Not+Found'; }}
//             />
//             {/* Padding is reduced (p-3 instead of p-4) */}
//             <div className="p-3">
//                 {/* Text size for the value is smaller (text-2xl instead of text-3xl) */}
//                 <p className="text-2xl font-bold text-gray-800">{value}</p>
//                 {/* Text size for the title is smaller (text-sm) */}
//                 <p className="text-sm text-gray-600">{title}</p>
//             </div>
//             {/* Padding on the bottom is reduced */}
//             <div className="px-3 pb-3">
//                  <button 
//                     onClick={() => navigateTo(linkTo)} 
//                     className="w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
//                 >
//                     View All
//                  </button>
//             </div>
//         </div>
//     );
// }

import React from 'react';
import { ChevronRight } from 'lucide-react'; // For the arrow icon

// Props: title, value, navigateTo (function), linkTo (page string), IconComponent (Lucide icon component)
export default function InfoCard({ title, value, navigateTo, linkTo, IconComponent }) {
  // Determine background color based on title (can be customized)
  const bgColorClass = {
    'Total Subjects': 'bg-green-100 text-green-700',
    'Total Students': 'bg-blue-100 text-blue-700',
    'Total Defaulters': 'bg-red-100 text-red-700',
    'Total Faculty': 'bg-yellow-100 text-yellow-700',
    'Departments': 'bg-purple-100 text-purple-700',
    'Settings': 'bg-gray-100 text-gray-700',
  }[title] || 'bg-gray-100 text-gray-700'; // Default if no match

  const hoverBgClass = {
    'Total Subjects': 'hover:bg-green-200',
    'Total Students': 'hover:bg-blue-200',
    'Total Defaulters': 'hover:bg-red-200',
    'Total Faculty': 'hover:bg-yellow-200',
    'Departments': 'hover:bg-purple-200',
    'Settings': 'hover:bg-gray-200',
  }[title] || 'hover:bg-gray-200';

  return (
    <div className={`p-6 rounded-lg shadow-md flex flex-col justify-between ${bgColorClass} ${hoverBgClass} transition-colors duration-200 cursor-pointer`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {IconComponent && React.createElement(IconComponent, { size: 28, className: "text-current" })} {/* Render the passed IconComponent */}
      </div>
      <p className="text-4xl font-bold mb-4">{value}</p>
      <button 
        onClick={() => navigateTo(linkTo)} 
        className="w-full flex items-center justify-between px-4 py-2 bg-white bg-opacity-70 rounded-lg text-sm font-medium hover:bg-opacity-100 transition-colors duration-200"
      >
        View All
        <ChevronRight size={18} />
      </button>
    </div>
  );
}