import React from 'react';
import { ArrowLeft, ChevronRight, Printer, FileText } from 'lucide-react';

const SubjectDetail = ({ subject, students, onBack, onSelectStudent }) => {
    
    const getAttendanceBarColor = (percentage) => {
        if (percentage < 75) return 'bg-danger';
        return 'bg-blue-500';
    };

    if (!subject) {
        return (
            <div className="text-center">
                <p>No subject selected. Please go back and select a subject.</p>
                <button onClick={onBack} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
                    Go Back
                </button>
            </div>
        );
    }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
            <button onClick={onBack} className="flex items-center text-sm text-text-secondary hover:text-text-primary mb-2">
                <ArrowLeft size={16} className="mr-2" />
                Back to Subjects
            </button>
            <h2 className="text-3xl font-bold text-text-primary">{subject.name}</h2>
            <p className="text-text-secondary mt-1">Student attendance overview for this subject.</p>
        </div>
        <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-gray-50">
                <Printer size={18} className="mr-2"/>
                Print
            </button>
             <button className="flex items-center px-4 py-2 border border-border-color rounded-lg text-text-secondary hover:bg-gray-50">
                <FileText size={18} className="mr-2"/>
                Export
            </button>
        </div>
      </div>

      {/* Students List Card */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50">
                    <tr>
                        {/* *** COLUMNS REORDERED *** */}
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Roll No.</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Student Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">Attendance %</th>
                        <th className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-color">
                    {students.map((student) => (
                        // *** ADDED ONCLICK TO THE ROW ***
                        <tr 
                            key={student.id} 
                            className="cursor-pointer hover:bg-gray-50"
                            onClick={() => onSelectStudent(student)}
                        >
                            {/* *** COLUMNS REORDERED *** */}
                            <td className="px-6 py-4 whitespace-nowrap text-text-secondary">{student.rollNo}</td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium text-text-primary">{student.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-4">
                                        <div 
                                            className={`${getAttendanceBarColor(student.attendance)} h-2.5 rounded-full`} 
                                            style={{ width: `${student.attendance}%` }}>
                                        </div>
                                    </div>
                                    <span className={`font-medium text-sm ${student.attendance < 75 ? 'text-danger' : 'text-text-secondary'}`}>
                                        {student.attendance}%
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <ChevronRight size={20} className="text-gray-400"/>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;
