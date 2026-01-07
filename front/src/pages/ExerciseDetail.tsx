import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Code, FileText, ListChecks, User } from 'lucide-react';
import Quiz from '../components/Exercise/quiz';
import AICorrectionPanel, { type CorrectionResult } from '../components/Exercise/AICorrectionPanel';
import { exercisesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ExerciseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [exercise, setExercise] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [correction, setCorrection] = useState<CorrectionResult | null>(null);

  useEffect(() => {
    const fetchExercise = async () => {
      if (!isAuthenticated) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const data = await exercisesApi.getById(Number(id));
        setExercise(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercise();
  }, [id, isAuthenticated, navigate]);

  // Reset code when exercise changes
  useEffect(() => {
    setCode('');
    setIsCompleted(false);
  }, [exercise]);

  const handleCompleteExercise = () => {
    setIsCompleted(true);
  };

  const handleAICorrection = async (solution: string) => {
    if (!exercise) return;

    try {
      const result = await exercisesApi.correct(Number(id), solution);

      if (result.success && result.correction) {
        setCorrection(result.correction);

        if (result.correction.score !== null && result.correction.score >= 70) {
          handleCompleteExercise();
        }
      }

      return result;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to get AI correction');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Multiple choice':
        return <ListChecks className="w-6 h-6" />;
      case 'Text Answer':
        return <FileText className="w-6 h-6" />;
      case 'Code':
        return <Code className="w-6 h-6" />;
      default:
        return <FileText className="w-6 h-6" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Multiple choice':
        return 'from-teal-500 to-teal-600';
      case 'Text Answer':
        return 'from-blue-500 to-blue-600';
      case 'Code':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulte?: string) => {
    switch (difficulte?.toLowerCase()) {
      case 'facile':
        return 'bg-green-100 text-green-800';
      case 'moyen':
        return 'bg-yellow-100 text-yellow-800';
      case 'difficile':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading exercise...</div>
      </div>
    );
  }

  if (error || !exercise) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Exercise Not Found</h1>
          <Link
            to="/exercises"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Exercises</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/exercises"
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Exercises</span>
        </Link>

        {/* Exercise Header */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className={`bg-gradient-to-r ${getTypeColor(exercise.Type)} px-8 py-12 text-white`}>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                {getTypeIcon(exercise.Type)}
              </div>
              <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                {exercise.Type}
              </span>
              {exercise.difficulte && (
                <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(exercise.difficulte)}`}>
                  {exercise.difficulte}
                </span>
              )}
              {exercise.dureeEstimee && (
                <span className="px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold">
                  {exercise.dureeEstimee} min
                </span>
              )}
              {isCompleted && (
                <div className="flex items-center space-x-2 ml-auto px-4 py-1 bg-green-500 rounded-full text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  <span>Completed</span>
                </div>
              )}
            </div>
            <h1 className="text-4xl font-bold mb-4">{exercise.titre}</h1>
            {exercise.prenomEnseignant && exercise.nomEnseignant && (
              <div className="flex items-center space-x-2 mt-4 bg-white/10 rounded-lg px-3 py-2 max-w-fit">
                <User className="w-5 h-5 text-white/80" />
                <span className="text-white/80 text-sm">Enseignant :</span>
                <span
                  onClick={() => navigate(`/profil-ens/${exercise.idEnseignant}`)}
                  className="text-white font-semibold cursor-pointer hover:underline hover:text-white/90 transition"
                >
                  {exercise.prenomEnseignant} {exercise.nomEnseignant}
                </span>
              </div>
            )}
          </div>

          {/* Exercise Content */}
          <div className="px-8 py-6">
            {exercise.Type === 'Multiple choice' && (
              <Quiz exercise={exercise} onComplete={handleCompleteExercise} />
            )}

            {(exercise.Type === 'Text Answer' || exercise.Type === 'Code') && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {exercise.Type === 'Code' ? 'Problem Statement' : 'Question'}
                  </h2>
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {exercise.enonce}
                  </p>
                </div>

                <div className={exercise.Type === 'Code' ? 'mt-8' : ''}>
                  {exercise.Type === 'Code' && (
                    <h3 className="text-xl font-bold text-gray-900 mb-4">AI Code Review</h3>
                  )}
                  <AICorrectionPanel
                    exerciseType={exercise.Type}
                    question={exercise.enonce}
                    onSubmit={handleAICorrection}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation to other exercises */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Want More Practice?</h3>
          <p className="text-blue-100 mb-6">
            Continue with more exercises to improve your skills
          </p>
          <Link
            to="/exercises"
            className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Browse All Exercises
          </Link>
        </div>
      </div>
    </div>
  );
}
