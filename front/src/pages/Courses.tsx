import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { coursesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'Algo1' | 'Algo2'>('all');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getAll();
        setCourses(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses =
    filter === 'all' ? courses : courses.filter((course: any) => course.niveau === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive courses covering fundamental and advanced algorithmics in C
          </p>
        </div>

        <div className="flex justify-center space-x-4 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter('Algo1')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'Algo1'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Algo 1
          </button>
          <button
            onClick={() => setFilter('Algo2')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'Algo2'
                ? 'bg-orange-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Algo 2
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course: any) => (
            <CourseCard key={course.idCours} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center text-gray-600 mt-12">
            No courses available
          </div>
        )}
      </div>
    </div>
  );
}
