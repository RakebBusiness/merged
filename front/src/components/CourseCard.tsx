import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: any;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.idCours}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              course.niveau === 'Algo1'
                ? 'bg-green-100 text-green-800'
                : 'bg-orange-100 text-orange-800'
            }`}
          >
            {course.niveau}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{course.titre}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.description}</p>

        <div className="flex items-center text-blue-600 text-sm font-medium">
          <BookOpen className="w-4 h-4 mr-1" />
          <span>View Course</span>
        </div>
      </div>
    </Link>
  );
}
