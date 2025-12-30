import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, FileCode, Mail, Award, Briefcase } from 'lucide-react';
import { teachersApi } from '../services/api';

interface Teacher {
  idUser: number;
  nom: string;
  prenom: string;
  email: string;
  specialite: string;
  grade: string;
  courses: any[];
  exercises: any[];
}

export default function ProfilEnseignant() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      try {
        setLoading(true);
        const data = await teachersApi.getById(Number(id));
        setTeacher(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading teacher profile...</div>
      </div>
    );
  }

  if (error || !teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Teacher Not Found</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold">
                  {teacher.prenom.charAt(0)}{teacher.nom.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-4xl font-bold">
                  {teacher.prenom} {teacher.nom}
                </h1>
                {teacher.grade && (
                  <p className="text-indigo-100 text-lg mt-1">{teacher.grade}</p>
                )}
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {teacher.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-200" />
                  <span className="text-indigo-100">{teacher.email}</span>
                </div>
              )}
              {teacher.specialite && (
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 text-indigo-200" />
                  <span className="text-indigo-100">{teacher.specialite}</span>
                </div>
              )}
              <div className="flex items-center space-x-6 mt-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-indigo-200" />
                  <span className="text-indigo-100">
                    {teacher.courses.length} {teacher.courses.length === 1 ? 'Course' : 'Courses'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCode className="w-5 h-5 text-indigo-200" />
                  <span className="text-indigo-100">
                    {teacher.exercises.length} {teacher.exercises.length === 1 ? 'Exercise' : 'Exercises'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses</h2>
            {teacher.courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teacher.courses.map((course) => (
                  <Link
                    key={course.idCours}
                    to={`/courses/${course.idCours}`}
                    className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">
                        {course.titre}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          course.niveau === 'Algo1'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-100 text-orange-700'
                        }`}
                      >
                        {course.niveau}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {course.description}
                    </p>
                    {course.duree && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>{course.duree}</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No courses available yet.</p>
            )}
          </div>

          <div className="px-8 py-8 bg-gray-50 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Exercises</h2>
            {teacher.exercises.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teacher.exercises.map((exercise) => (
                  <Link
                    key={exercise.id}
                    to={`/exercises/${exercise.id}`}
                    className="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-md font-semibold text-gray-900 flex-1 line-clamp-1">
                        {exercise.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          exercise.type === 'qcm'
                            ? 'bg-teal-100 text-teal-700'
                            : exercise.type === 'quiz'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {exercise.type === 'qcm'
                          ? 'Multiple Choice'
                          : exercise.type === 'quiz'
                          ? 'Text Answer'
                          : 'Code'}
                      </span>
                      {exercise.difficulty && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            exercise.difficulty.toLowerCase() === 'facile'
                              ? 'bg-green-100 text-green-700'
                              : exercise.difficulty.toLowerCase() === 'moyen'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {exercise.difficulty}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No exercises available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
