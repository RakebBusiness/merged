// pages/ens-panel/components/exercises/ExerciseFilters.tsx
import { Search, Filter } from 'lucide-react';
import {ExerciseType } from '../../../types/exercise'

interface ExerciseFiltersProps {
  onSearch: (query: string) => void;
  onFilterChange: (type: ExerciseType | 'all') => void;
  currentType: ExerciseType | 'all';
  stats: {
    total: number;
    qcm: number;
    quiz: number;
    code: number;
  };
}

const ExerciseFilters: React.FC<ExerciseFiltersProps> = ({
  onSearch,
  onFilterChange,
  currentType,
  stats
}) => {
  const filters = [
    { id: 'all', label: 'Tous', count: stats.total, color: 'bg-gray-100 hover:bg-gray-200 text-gray-700' },
    { id: 'qcm', label: 'QCM', count: stats.qcm, color: 'bg-purple-100 hover:bg-purple-200 text-purple-700' },
    { id: 'quiz', label: 'Quiz', count: stats.quiz, color: 'bg-green-100 hover:bg-green-200 text-green-700' },
    { id: 'code', label: 'Code', count: stats.code, color: 'bg-blue-100 hover:bg-blue-200 text-blue-700' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Barre de recherche */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un exercice..."
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtres par type */}
        <div className="flex items-center gap-2">
          <Filter className="text-gray-400 w-5 h-5 flex-shrink-0" />
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${filter.color} ${
                  currentType === filter.id ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                }`}
              >
                {filter.label}
                <span className="ml-1.5 px-1.5 py-0.5 bg-white/50 rounded text-xs">
                  {filter.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseFilters;