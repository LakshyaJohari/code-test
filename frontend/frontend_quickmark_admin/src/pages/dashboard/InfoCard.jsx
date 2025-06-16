// src/components/dashboard/InfoCard.jsx
import React from 'react';

export default function InfoCard({ title, value, navigateTo, linkTo, imageUrl }) {
    return (
        // The main card container
        <div className="w-45 bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            {/* The image is now shorter (h-40 instead of h-48) */}
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-40 object-cover"
              onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x300/cccccc/ffffff?text=Image+Not+Found'; }}
            />
            {/* Padding is reduced (p-3 instead of p-4) */}
            <div className="p-3">
                {/* Text size for the value is smaller (text-2xl instead of text-3xl) */}
                <p className="text-2xl font-bold text-gray-800">{value}</p>
                {/* Text size for the title is smaller (text-sm) */}
                <p className="text-sm text-gray-600">{title}</p>
            </div>
            {/* Padding on the bottom is reduced */}
            <div className="px-3 pb-3">
                 <button 
                    onClick={() => navigateTo(linkTo)} 
                    className="w-full text-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                >
                    View All
                 </button>
            </div>
        </div>
    );
}
