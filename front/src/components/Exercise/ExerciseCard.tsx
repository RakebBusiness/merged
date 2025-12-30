import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, ArrowRight, Code, FileText, ListChecks } from 'lucide-react';

interface ExerciseCardProps {
  exercise: {
    idExercice: string;
    titre: string;
    enonce: string;
    Type: string;
    difficulte?: string;
    dureeEstimee?: number;
  };
  isCompleted: boolean;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, isCompleted }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Multiple choice':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Text Answer':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Code':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getDifficultyColor = (difficulte?: string) => {
    switch (difficulte?.toLowerCase()) {
      case 'facile':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'moyen':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'difficile':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Multiple choice':
        return <ListChecks className="w-5 h-5" />;
      case 'Text Answer':
        return <FileText className="w-5 h-5" />;
      case 'Code':
        return <Code className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getCardGradient = (type: string) => {
    switch (type) {
      case 'Multiple choice':
        return 'hover:shadow-teal-100';
      case 'Text Answer':
        return 'hover:shadow-blue-100';
      case 'Code':
        return 'hover:shadow-green-100';
      default:
        return 'hover:shadow-gray-100';
    }
  };

  return (
    <Link
      to={`/exercises/${exercise.idExercice}`}
      className={`block bg-white rounded-xl shadow-md overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${getCardGradient(exercise.Type)} ${
        isCompleted ? 'ring-2 ring-green-400 ring-offset-2' : ''
      }`}
    >
      <div className="p-6">
        {/* Header with Icon and Status */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${getTypeColor(exercise.Type)}`}>
            {getTypeIcon(exercise.Type)}
          </div>
          {isCompleted && (
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Completed</span>
            </div>
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {exercise.titre}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {exercise.enonce}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(exercise.Type)}`}>
            {exercise.Type}
          </span>

          {exercise.difficulte && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(exercise.difficulte)}`}>
              {exercise.difficulte}
            </span>
          )}

          {exercise.dureeEstimee && (
            <span className="px-3 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{exercise.dureeEstimee} min</span>
            </span>
          )}
        </div>

        {/* Call to Action */}
        <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:text-blue-700 pt-2 border-t border-gray-100">
          <span className="mr-2">Start Exercise</span>
          <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default ExerciseCard;