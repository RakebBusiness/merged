import { useState, useEffect } from 'react';
import ExerciseCard from '../components/Exercise/ExerciseCard';
import { exercisesApi } from '../services/api';

export default function Exercises() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'Multiple choice' | 'Text Answer' | 'Code'>('all');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        const data = await exercisesApi.getAll();
        setExercises(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, []);

  const filteredExercises =
    filter === 'all' ? exercises : exercises.filter((ex: any) => ex.Type === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading exercises...</div>
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
            Practice Exercises
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with interactive exercises and coding challenges
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Multiple choice')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'Multiple choice'
                ? 'bg-teal-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Multiple Choice
          </button>
          <button
            onClick={() => setFilter('Text Answer')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'Text Answer'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Text Answer
          </button>
          <button
            onClick={() => setFilter('Code')}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              filter === 'Code'
                ? 'bg-green-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Code
          </button>
        </div>

        <div className="mb-8 max-w-2xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-900 font-semibold text-lg">
              Your Progress
            </p>
            <p className="text-blue-700 font-bold text-xl">
              {completedExercises.size} / {exercises.length}
            </p>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
              style={{
                width: `${exercises.length > 0 ? (completedExercises.size / exercises.length) * 100 : 0}%`
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise: any) => (
            <ExerciseCard
              key={exercise.idExercice}
              exercise={exercise}
              isCompleted={completedExercises.has(exercise.idExercice)}
            />
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center text-gray-600 mt-12">
            <p className="text-lg">No exercises available for this filter</p>
          </div>
        )}
      </div>
    </div>
  );
}