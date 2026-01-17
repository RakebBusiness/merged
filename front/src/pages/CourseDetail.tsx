import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, CheckCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { coursesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import FocusTracker from '../components/FocusTracker';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getById(Number(id));
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      setEnrolling(true);
      await coursesApi.enroll(Number(id));
      const data = await coursesApi.getById(Number(id));
      setCourse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  const handleFinishCourse = async () => {
    try {
      await coursesApi.finish(Number(id));
      const data = await coursesApi.getById(Number(id));
      setCourse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleFocusUpdate = async (focusTime: number, totalTime: number) => {
    try {
      await coursesApi.updateConcentration(Number(id), focusTime, totalTime);
    } catch (err: any) {
      console.error('Failed to update concentration time:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading course...</div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <Link to="/courses" className="text-blue-600 hover:text-blue-700">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/courses"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Courses</span>
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="flex items-center space-x-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${course.niveau === 'Algo1'
                  ? 'bg-green-500'
                  : 'bg-orange-500'
                  }`}
              >
                {course.niveau}
              </span>
              {course.duree && (
                <div className="flex items-center text-blue-100">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm">{course.duree}</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{course.titre}</h1>
            <p className="text-xl text-blue-100">{course.description}</p>
            
            {/* Affichage conditionnel avec débogage */}
            {course.prenomEnseignant && course.nomEnseignant ? (
              <div className="flex items-center space-x-2 mt-4 bg-white/10 rounded-lg px-3 py-2 max-w-fit">
                <User className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm">Enseignant :</span>
                <span
                  onClick={() => {
                    navigate(`/profil-ens/${course.idEnseignant}`);
                  }}
                  className="text-white font-semibold cursor-pointer hover:underline hover:text-white/90 transition"
                >
                  {course.prenomEnseignant} {course.nomEnseignant}
                </span>
              </div>
            ) : (
              <div className="mt-4 p-3 bg-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-100">
                  ⚠️ Données enseignant manquantes - Vérifier la console pour plus de détails
                </p>
              </div>
            )}
          </div>

          {course.topics && course.topics.length > 0 && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Topics Covered</h2>
              <div className="flex flex-wrap gap-2">
                {course.topics.map((topic: any) => (
                  <span
                    key={topic.idTopic}
                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {topic.nom}
                  </span>
                ))}
              </div>
            </div>
          )}

          {course.enrollmentData && (
            <div className="px-8 py-6 border-b border-gray-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-semibold text-gray-900">Enrolled</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Started: {new Date(course.enrollmentData.enrolledAt).toLocaleDateString()}
                  </p>
                  {course.enrollmentData.completed && course.enrollmentData.finishedAt && (
                    <p className="text-sm text-green-600 font-semibold mt-1">
                      Completed: {new Date(course.enrollmentData.finishedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {!course.enrollmentData.completed && (
                  <button
                    onClick={handleFinishCourse}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
              {course.enrollmentData.progress > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{course.enrollmentData.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.enrollmentData.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {course.sections && course.sections.length > 0 && (
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Outline</h2>
              <div className="space-y-2">
                {course.sections.map((section: any, index: number) => (
                  <div key={index} className="flex items-center space-x-3 py-2">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700">{section.section}</span>
                    {!course.isEnrolled && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {!course.isEnrolled && isAuthenticated && (
            <div className="px-8 py-8 bg-gray-50 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Enroll to Access Course Content</h3>
              <p className="text-gray-600 mb-6">
                Get full access to all course materials, including theory, code examples, and exercises.
              </p>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            </div>
          )}

          {!course.isEnrolled && !isAuthenticated && (
            <div className="px-8 py-8 bg-gray-50 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Login to Enroll</h3>
              <p className="text-gray-600 mb-6">
                Sign in to enroll in this course and access all course materials.
              </p>
              <Link
                to="/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            </div>
          )}

          {course.isEnrolled && (
            <div className="px-8 py-6">
              <FocusTracker onFocusUpdate={handleFocusUpdate} />
            </div>
          )}

          {course.content && course.content.length > 0 && course.isEnrolled && (
            <div className="px-8 py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
              <div className="space-y-6">
                {course.content.map((section: any) => (
                  <div key={section.idSection} className="border-l-4 border-blue-500 pl-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{section.section}</h3>
                    <div className="prose max-w-none mb-4">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {section.theorie}
                      </p>
                    </div>
                    {section.codeExample && (
                      <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <pre className="text-sm text-gray-100">
                          <code>{section.codeExample}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Practice?</h3>
          <p className="text-blue-100 mb-6">
            Test your knowledge with exercises related to this course
          </p>
          <Link
            to="/exercises"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Go to Exercises
          </Link>
        </div>
      </div>
    </div>
  );
}